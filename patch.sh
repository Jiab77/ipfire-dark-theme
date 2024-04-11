#!/usr/bin/env bash
# shellcheck disable=SC2034

# Basic dark mode install/update/remove script for IPFire
# Made by Jiab77 - 2022
#
# Version 0.5.8

# Options
[[ -r $HOME/.debug ]] && set -o xtrace || set +o xtrace

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
NO_HEADER=false
REMOVE_MODE=false
RESET_MODE=false
UPDATE_MODE=false
DO_PATCH_UPDATE=false
ENABLE_SRI=true
BIN_GIT=$(which git 2>/dev/null)
BASE_DIR=$(dirname "$0")
# INSTALL_PATH="/srv/web/ipfire/html/themes/ipfire/include/js"
INSTALL_PATH="/srv/web/ipfire/html/include"
FILE_TO_PATCH="/srv/web/ipfire/html/themes/ipfire/include/functions.pl"
# LINE_TO_PATCH="</head>"
LINE_TO_PATCH="</body>"
LINE_TO_PATCH_POS=$(grep -n "$LINE_TO_PATCH" "$FILE_TO_PATCH" 2>/dev/null | awk '{ print $1 }' | sed -e 's/://')
PATCH_CONTENT="\n\t<script src=\"/include/darkmode.js\" async defer></script>\n\t${LINE_TO_PATCH}"
SRI_FILE="$BASE_DIR/patch.js.sri"
SRI_STRING="NPXhjUcE2TVeAAe/K1aXUbsrqRxnFfOsKD0lwB8KGzdTK36H3V3wS/tEp9+44OKGiTdzuq+SGqEjXrpWvycH2Q=="
PATCH_CONTENT_SRI="\n\t<script src=\"/include/darkmode.js\" integrity=\"sha512-${SRI_STRING}\" crossorigin=\"anonymous\" async defer></script>\n\t${LINE_TO_PATCH}"

# Functions
function get_version() {
    grep -i 'version' "$0" | awk '{ print $3 }' | head -n1
}
function get_versions() {
    echo -en "${WHITE}Gathering file versions...${NC}"
    CURRENT_INSTALLER_VERSION=$(grep -i 'version' "$0" | awk '{ print $3 }' | head -n1)
    CURRENT_PATCH_VERSION=$(grep -i 'version' "$(dirname "$0")/$(basename "$0" | sed -e 's/.sh/.js/gi')" | awk '{ print $3 }' | head -n1)
    if [[ -z $CURRENT_INSTALLER_VERSION || -z $CURRENT_PATCH_VERSION ]]; then
        echo -e " ${RED}failed${NC}${NL}"
        exit 1
    else
        echo -e " ${GREEN}done${NC}${NL}"
        echo -e "${WHITE} - Installer: ${YELLOW}${CURRENT_INSTALLER_VERSION}${NC}"
        echo -e "${WHITE} - Patch: ${YELLOW}${CURRENT_PATCH_VERSION}${NC}"
        echo
    fi
}
function get_change_log() {
    # Detect if git is installed
    [[ -z $BIN_GIT ]] && echo -e "${RED}Error: ${YELLOW}You must have 'git' installed to run this script.${NC}${NL}" && exit 1

    # Display latest changes
    echo -e "${WHITE}Loading changes summary...${NC}${NL}"
    git log -n5
    echo -e "${NL}${WHITE}Done.${NC}${NL}"
}
function sanity_check() {
    echo -en "${WHITE}Running sanity check...${NC}"
    if [[ -n $LINE_TO_PATCH_POS ]]; then
        echo -e " ${GREEN}passed${NC}${NL}"
    else
        echo -e "${NL}${NL}${RED}Error: ${YELLOW}Unable to find corresponding line. Leaving...${NC}${NL}"
        exit 1
    fi
}
function apply_patch() {
    sanity_check

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
        if [[ $RET_CODE_PATCH -eq 0 ]]; then
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
        if [[ $RET_CODE_REMOVE -eq 0 ]]; then
            echo -e " ${GREEN}done${NC}${NL}"
        else
            echo -e " ${RED}failed${NC}${NL}"
        fi
    fi
}
function update_patch() {
    # Get current patch and installer versions
    # from local files
    get_versions

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
    LATEST_PATCH_VERSION=$(grep -i 'version' "$(dirname "$0")/$(basename "$0" | sed -e 's/.sh/.js/gi')" | awk '{ print $3 }' | head -n1)
    LATEST_INSTALLER_VERSION=$(grep -i 'version' "$0" | awk '{ print $3 }' | head -n1)
    if [[ -n $LATEST_PATCH_VERSION && ! "$CURRENT_PATCH_VERSION" == "$LATEST_PATCH_VERSION" ]]; then
        DO_PATCH_UPDATE=true
        echo -e " ${YELLOW}update available${NC}${NL}"
    elif [[ -n $LATEST_INSTALLER_VERSION && ! "$CURRENT_INSTALLER_VERSION" == "$LATEST_INSTALLER_VERSION" ]]; then
        DO_PATCH_UPDATE=true
        echo -e " ${YELLOW}update available${NC}${NL}"
    else
        echo -e " ${BLUE}nothing to update${NC}${NL}"
    fi

    # Run the update process if necessary
    if [[ $DO_PATCH_UPDATE == true ]]; then
        if [[ -n $LATEST_PATCH_VERSION && ! "$CURRENT_PATCH_VERSION" == "$LATEST_PATCH_VERSION" ]]; then
            echo -e "${WHITE} - New patch version: ${YELLOW}${LATEST_PATCH_VERSION}${NC}"
        fi
        if [[ -n $LATEST_INSTALLER_VERSION && ! "$CURRENT_INSTALLER_VERSION" == "$LATEST_INSTALLER_VERSION" ]]; then
            echo -e "${WHITE} - New installer version: ${YELLOW}${LATEST_INSTALLER_VERSION}${NC}"
        fi

        # Adding one line for better reading
        echo

        # Remove existing version
        "$0" -r --no-header

        # Install latest version
        "$0" --no-header
    fi
}

# Header
[[ $1 == "--no-header" || $2 == "--no-header" ]] && NO_HEADER=true
if [[ ! $NO_HEADER == true ]]; then
    echo -e "${NL}${BLUE}Basic dark mode ${PURPLE}install/update/remove${BLUE} script for IPFire - ${GREEN}v$(get_version)${NC}${NL}"
fi

# Usage
[[ $1 == "-h" || $1 == "--help" ]] && echo -e "${NL}Usage: $(basename "$0") [-r|--remove, -u|--update, -v|--version, -c|--changelog, -s|--sanity] [--no-sri]${NL}" && exit 1

# Arguments
[[ $1 == "-R" || $1 == "--reset" ]] && RESET_MODE=true
[[ $1 == "-r" || $1 == "--remove" ]] && REMOVE_MODE=true
[[ $1 == "-u" || $1 == "--update" ]] && UPDATE_MODE=true
[[ $1 == "-v" || $1 == "--version" ]] && get_versions && exit 1
[[ $1 == "-c" || $1 == "--changelog" ]] && get_change_log && exit 1
[[ $1 == "-s" || $1 == "--sanity" ]] && sanity_check && exit 1
[[ $1 == "--no-sri" || $2 == "--no-sri" ]] && ENABLE_SRI=false

# Checks
[[ $(id -u) -ne 0 ]] && echo -e "${RED}Error: ${YELLOW}You must run this script as 'root' or with 'sudo'.${NC}${NL}" && exit 1
[[ -z $BIN_GIT ]] && echo -e "${RED}Error: ${YELLOW}You must have 'git' installed to run this script.${NC}${NL}" && exit 1
[[ $# -gt 2 ]] && echo -e "${RED}Error: ${YELLOW}Too many arguments.${NC}${NL}" && exit 1
[[ $# -eq 0 && -f "$FILE_TO_PATCH.before-patch" ]] && echo -e "${RED}Error: ${YELLOW}Already patched. Run the script again with '${PURPLE}-r${YELLOW}' to remove the patch.${NC}${NL}" && exit 1
[[ ! -f $FILE_TO_PATCH ]] && echo -e "${RED}Error: ${YELLOW}Can't read '${PURPLE}${FILE_TO_PATCH}${YELLOW}'.${NC}${NL}" && exit 1
[[ $ENABLE_SRI == true && ! -f $SRI_FILE ]] && echo -e "${RED}Error: ${YELLOW}Missing 'SRI' file.${NC}${NL}" && exit 1
[[ $ENABLE_SRI == true && ! "$SRI_STRING" == "$(cat "$SRI_FILE")" ]] && echo -e "${RED}Error: ${YELLOW}Invalid 'SRI'.${NC}${NL}" && exit 1

# Main
if [[ $RESET_MODE == true ]]; then
    remove_patch
    apply_patch
elif [[ $REMOVE_MODE == true ]]; then
    remove_patch
elif [[ $UPDATE_MODE == true ]]; then
    update_patch
else
    apply_patch
fi
