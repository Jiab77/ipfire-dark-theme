#!/usr/bin/env bash
# shellcheck disable=SC2034

# Basic dark mode install/remove script for IPFire
# Made by Jiab77 - 2022
#
# Version 0.1.0

# Colors
NC="\033[0m"
NL="\n"
BLUE="\033[1;34m"
YELLOW="\033[1;33m"
GREEN="\033[1;32m"
RED="\033[1;31m"
WHITE="\033[1;37m"
PURPLE="\033[1;35m"

# Options
set +o xtrace

# Config
REMOVE_MODE=false
BASE_DIR=$(dirname "$0")
# INSTALL_PATH="/srv/web/ipfire/html/themes/ipfire/include/js"
INSTALL_PATH="/srv/web/ipfire/html/include"
FILE_TO_PATCH="/srv/web/ipfire/html/themes/ipfire/include/functions.pl"
LINE_TO_PATCH="</body>"
LINE_TO_PATCH_POS=$(grep -n "$LINE_TO_PATCH" "$FILE_TO_PATCH" 2>/dev/null | awk '{ print $1 }' | sed -e 's/://')
PATCH_CONTENT="\n\t<script src=\"/include/darkmode.js\"></script>\n</body>"

# Functions
function get_version() {
    grep -i 'version' "$0" | awk '{ print $3 }' | head -n1
}
function apply_patch() {
    echo -en "${NL}${WHITE}Applying dark mode patch...${NC}"
    install -m 644 "$BASE_DIR/patch.js" "$INSTALL_PATH/darkmode.js" &>/dev/null
    RET_CODE_INSTALL=$?
    if [[ $RET_CODE_INSTALL -eq 0 ]]; then
        cp -a "$FILE_TO_PATCH" "${FILE_TO_PATCH}.before-patch"
        sed -e 's|'"$LINE_TO_PATCH"'|'"$PATCH_CONTENT"'|' -i "$FILE_TO_PATCH"
        RET_CODE_PATCH=$?
        if [[ $RET_CODE_INSTALL -eq 0 ]]; then
            echo -e " ${GREEN}done${NC}${NL}"
        else
            echo -e " ${RED}failed${NC}${NL}"
        fi
    fi
}
function remove_patch() {
    echo -en "${NL}${WHITE}Removing dark mode patch...${NC}"
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

# Header
echo -e "${NL}${BLUE}Basic dark mode ${PURPLE}install/remove${BLUE} script for IPFire - ${GREEN}v$(get_version)${NC}"

# Usage
[[ $1 == "-h" || $1 == "--help" ]] && echo -e "${NL}Usage: $(basename "$0") [-r|--remove]${NL}" && exit 1

# Checks
[[ $(id -u) -ne 0 ]] && echo -e "${NL}${RED}Error: ${YELLOW}You must run this script as 'root' or with 'sudo'.${NC}${NL}" && exit 1
[[ $# -gt 1 ]] && echo -e "${NL}${RED}Error: ${YELLOW}Too many arguments.${NC}${NL}" && exit 1
[[ $# -eq 0 && -f "$FILE_TO_PATCH.before-patch" ]] && echo -e "${NL}${RED}Error: ${YELLOW}Already patched. Run the script again with '${PURPLE}-r${YELLOW}' to remove the patch.${NC}${NL}" && exit 1
[[ ! -f $FILE_TO_PATCH ]] && echo -e "${NL}${RED}Error: ${YELLOW}Can't read '${PURPLE}${FILE_TO_PATCH}${YELLOW}'.${NC}${NL}" && exit 1

# Arguments
[[ $1 == "-r" || $1 == "--remove" ]] && REMOVE_MODE=true

# Process
if [[ $REMOVE_MODE == true ]]; then
    remove_patch
else
    apply_patch
fi
