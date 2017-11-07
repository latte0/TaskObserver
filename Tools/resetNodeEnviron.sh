#!/usr/bin/env bash
# Copyright (c) 2016 Shota Shimazu
# This program is freely distributed under the MIT, see LICENSE for detail.



function warning () {
	echo "+-------------------------- WARNING --------------------------+"
	echo "|    THIS SCRIPT WILL REMOVE ALL DATA OF YOUR NODE.JS.        |"
	echo "|    TAHT DATA INCLUDES NODE MODULES THAT IS INSTALEED AND    |"
	echo "|    UNABLE ALL VERSION OF NODE.JS                            |"
	echo "+-------------------------------------------------------------+"
	echo "Press [return] key to continue."
	read
}

function clean () {
	cd $HOME
	cd .Toolchains/
	rm -rf nodejs/
	cd ..
	rm -rf .npm/
	cd ..
}

function main () {
	warning
	clean
}


main 