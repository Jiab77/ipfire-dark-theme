#!/usr/bin/env bash
# shellcheck disable=SC2034

# Basic dark mode install/update/remove script for IPFire
# Made by Jiab77 - 2022
#
# Version 0.3.4

# Options
set +o xtrace

# Colors
NC="\033[0m"
NL="\n"
BLUE="\033[1;34m"
YELLOW="\033[1;33m"
GREEN="\033[1;32m"
RED="\033[1;31m"
WHITE="\033[1;37m"
PURPLE="\033[1;35m"

# Config
REMOVE_MODE=false
UPDATE_MODE=false
DO_PATCH_UPDATE=false
ENABLE_SRI=true
BIN_GIT=$(which git 2>/dev/null)
BASE_DIR=$(dirname "$0")
# INSTALL_PATH="/srv/web/ipfire/html/themes/ipfire/include/js"
INSTALL_PATH="/srv/web/ipfire/html/include"
FILE_TO_PATCH="/srv/web/ipfire/html/themes/ipfire/include/functions.pl"
LINE_TO_PATCH="</body>"
LINE_TO_PATCH_POS=$(grep -n "$LINE_TO_PATCH" "$FILE_TO_PATCH" 2>/dev/null | awk '{ print $1 }' | sed -e 's/://')
PATCH_CONTENT="\n\t<script src=\"/include/darkmode.js\"></script>\n</body>"
SRI_FILE="$BASE_DIR/patch.js.sri"
SRI_STRING="1YAFr9FMYhgECnQjyDzneToBGpbmKppoBZ9t+V7p9eGgL2Cnh5MVY/ToYjG7oGU7IVJXhv4DwPlmI+3j0hZO7A=="
PATCH_CONTENT_SRI="\n\t<script src=\"/include/darkmode.js\" integrity=\"sha512-${SRI_STRING}\" crossorigin=\"anonymous\"></script>\n</body>"

# Functions
function get_version() {
    grep -i 'version' "$0" | awk '{ print $3 }' | head -n1
}
function apply_patch() {
    echo -en "${WHITE}Installing dark mode patch...${NC}"
    install -m 644 "$BASE_DIR/patch.js" "$INSTALL_PATH/darkmode.js" &>/dev/null
    RET_CODE_INSTALL=$?
    if [[ $RET_CODE_INSTALL -eq 0 ]]; then
        cp -a "$FILE_TO_PATCH" "${FILE_TO_PATCH}.before-patch"
        if [[ $ENABLE_SRI == true ]]; then
            sed -e 's|'"$LINE_TO_PATCH"'|'"$PATCH_CONTENT_SRI"'|' -i "$FILE_TO_PATCH"
        else
            sed -e 's|'"$LINE_TO_PATCH"'|'"$PATCH_CONTENT"'|' -i "$FILE_TO_PATCH"
        fi
        RET_CODE_PATCH=$?
        if [[ $RET_CODE_INSTALL -eq 0 ]]; then
            echo -e " ${GREEN}done${NC}${NL}"
        else
            echo -e " ${RED}failed${NC}${NL}"
        fi
    fi
}
function remove_patch() {
    echo -en "${WHITE}Removing dark mode patch...${NC}"
    if [[ -f "$FILE_TO_PATCH.before-patch" ]]; then
        cp -a "$FILE_TO_PATCH" "$FILE_TO_PATCH.restore-patch"
        mv "$FILE_TO_PATCH.before-patch" "$FILE_TO_PATCH"
        rm -f "$INSTALL_PATH/darkmode.js"
        RET_CODE_REMOVE=$?
        if [[ $RET_CODE_INSTALL -eq 0 ]]; then
            echo -e " ${GREEN}done${NC}${NL}"
        else
            echo -e " ${RED}failed${NC}${NL}"
        fi
    fi
}
function update_patch() {
    # Get current patch version
    echo -en "${WHITE}Gathering installed patch version...${NC}"
    CURRENT_PATCH_VERSION=$(grep -i 'version' patch.js | awk '{ print $3 }' | head -n1)
    if [[ -n $CURRENT_PATCH_VERSION ]]; then
        echo -e " ${GREEN}${CURRENT_PATCH_VERSION}${NC}${NL}"
    else
        echo -e " ${RED}failed${NC}${NL}"
        exit 1
    fi

    # Get current installer version
    echo -en "${WHITE}Gathering local patch installer version...${NC}"
    CURRENT_INSTALLER_VERSION=$(grep -i 'version' patch.sh | awk '{ print $3 }' | head -n1)
    if [[ -n $CURRENT_INSTALLER_VERSION ]]; then
        echo -e " ${GREEN}${CURRENT_INSTALLER_VERSION}${NC}${NL}"
    else
        echo -e " ${RED}failed${NC}${NL}"
        exit 1
    fi

    # Fetch latest version
    echo -en "${WHITE}Fetching latest version...${NC}"
    git fetch &>/dev/null && git pull &>/dev/null
    RET_CODE_FETCH=$?
    if [[ $RET_CODE_FETCH -eq 0 ]]; then
        echo -e " ${GREEN}done${NC}${NL}"
    else
        echo -e " ${RED}failed${NC}${NL}"
        exit 1
    fi

    # Check fetched version
    echo -en "${WHITE}Gathering fetched versions...${NC}"
    LATEST_PATCH_VERSION=$(grep -i 'version' patch.js | awk '{ print $3 }' | head -n1)
    LATEST_INSTALLER_VERSION=$(grep -i 'version' patch.sh | awk '{ print $3 }' | head -n1)
    if [[ -n $LATEST_PATCH_VERSION && ! "$CURRENT_PATCH_VERSION" == "$LATEST_PATCH_VERSION" ]]; then
        DO_PATCH_UPDATE=true
        echo -e " ${GREEN}update available${NC}${NL}"
    elif [[ -n $LATEST_INSTALLER_VERSION && ! "$CURRENT_INSTALLER_VERSION" == "$LATEST_INSTALLER_VERSION" ]]; then
        echo -e " ${GREEN}installer updated${NC}${NL}"
        echo -e "${WHITE} - New installer version: ${YELLOW}${LATEST_INSTALLER_VERSION}${NC}${NL}"
    else
        echo -e " ${BLUE}nothing to update${NC}${NL}"
    fi
    if [[ $DO_PATCH_UPDATE == true ]]; then
        echo -e "${WHITE} - New patch version: ${YELLOW}${LATEST_PATCH_VERSION}${NC}"

        # Remove existing version
        remove_patch

        # Install latest version
        apply_patch
    fi
}

# Header
echo -e "${NL}${BLUE}Basic dark mode ${PURPLE}install/update/remove${BLUE} script for IPFire - ${GREEN}v$(get_version)${NC}${NL}"

# Usage
[[ $1 == "-h" || $1 == "--help" ]] && echo -e "${NL}Usage: $(basename "$0") [-r|--remove, -u|--update]${NL}" && exit 1

# Checks
[[ $(id -u) -ne 0 ]] && echo -e "${RED}Error: ${YELLOW}You must run this script as 'root' or with 'sudo'.${NC}${NL}" && exit 1
[[ -z $BIN_GIT ]] && echo -e "${RED}Error: ${YELLOW}You must have 'git' installed to run this script.${NC}${NL}" && exit 1
[[ $# -gt 1 ]] && echo -e "${RED}Error: ${YELLOW}Too many arguments.${NC}${NL}" && exit 1
[[ $# -eq 0 && -f "$FILE_TO_PATCH.before-patch" ]] && echo -e "${RED}Error: ${YELLOW}Already patched. Run the script again with '${PURPLE}-r${YELLOW}' to remove the patch.${NC}${NL}" && exit 1
[[ ! -f $FILE_TO_PATCH ]] && echo -e "${RED}Error: ${YELLOW}Can't read '${PURPLE}${FILE_TO_PATCH}${YELLOW}'.${NC}${NL}" && exit 1
[[ $ENABLE_SRI == true && ! -f $SRI_FILE ]] && echo -e "${RED}Error: ${YELLOW}Missing 'SRI' file.${NC}${NL}" && exit 1
[[ $ENABLE_SRI == true && ! "$SRI_STRING" == "$(cat "$SRI_FILE")" ]] && echo -e "${RED}Error: ${YELLOW}Invalid 'SRI'.${NC}${NL}" && exit 1

# Arguments
[[ $1 == "-r" || $1 == "--remove" ]] && REMOVE_MODE=true
[[ $1 == "-u" || $1 == "--update" ]] && UPDATE_MODE=true

# Main
if [[ $REMOVE_MODE == true ]]; then
    remove_patch
elif [[ $UPDATE_MODE == true ]]; then
    update_patch
else
    apply_patch
fi
