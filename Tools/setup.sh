#!/usr/bin/env bash
# Copyright (c) 2016 Shota Shimazu
# This program is freely distributed under the MIT, see LICENSE for detail.



NODE_TMP=".NODE_INSTALL_TMP/"


function command_exists {
  command -v "$1" > /dev/null;
}


function DownloadFiles () {
	if [ -e $NODE_TMP ]; then
		rm -rf $NODE_TMP
	else
		mkdir -p $NODE_TMP
	fi
	cd $NODE_TMP
	echo "Downloading latest Node.js ..."
	curl -O "https://nodejs.org/dist/v6.3.1/node-v6.3.1-darwin-x64.tar.gz"
	cd ..
}


function InstallNode () {
	cd $NODE_TMP
	echo "Extracting package file..."
	tar -zxf node-v6.3.1-darwin-x64.tar.gz
	mkdir -p $HOME/.Toolchains/nodejs/
	echo "Installing..."
	mv node-v6.3.1-darwin-x64/ $HOME/.Toolchains/nodejs/v6.3.1/
	cd ..
}


function GenRC () {
	echo "Adding path..."
	echo 'export PATH=$HOME/.Toolchains/nodejs/v6.3.0/bin:"${PATH}"' >> $HOME/.bash_profile
}



function InstallRequirements () {
	if [ -e $HOME/.npm/node-sass/ ]; then
		echo "node-sass is already installed."
		echo "Skip installing node-sass."
	else
		echo "Installing node-sass..."
		npm install -g node-sass
	fi
	if [ -e $HOME/.npm/jade/ ]; then
		echo "jade is already installed."
		echo "Skip installing jade."
	else
		echo "Installing jade..."
		npm install -g jade
	fi
  if [ -e $HOME/.npm/typescript/ ]; then
    echo "Typescript is already installed."
    echo "Skip installing typescript."
  else
    echo "Installing typescript..."
    npm install -g typescript
  fi
}


function Clean () {
	if [ -e $NODE_TMP ]; then
		rm -rf $NODE_TMP
	fi
}

function main () {
	echo "Requirements Installer  v0.0.1"
	echo "Copyright (c) 2016 Shota Shimazu"
	echo "This program is freely distributed under the MIT, see LICENSE for detail."
	echo
	echo "Press [return] key to continue."
	read

  echo "<!>WARNING<!>"
  echo "This script supports macOS only now!"
  echo ""
  echo "Press [return] to continue."
  read
  

	if ! command_exists node; then
		DownloadFiles
		InstallNode
		GenRC
	else
		NODE_VER=$(node -v)
		if echo $NODE_VER | grep -q "v6.3.0"; then
			echo "Latest Node.js is already installed."
			echo "Skip installing Node.js"
		else
			if which node | grep -q "homebrew"; then
				DownloadFiles
				InstallNode
				GenRC
			else
				echo "Latest Node.js is already installed."
				echo "Skip installing node."
			fi
		fi
	fi
	source $HOME/.bash_profile
	InstallRequirements
	Clean
	echo "Completed."
	echo "Press [return] key to exit."
	read
	exit 0
}


main
