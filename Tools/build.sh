#!/usr/bin/env


HOME_DIR = $HOME


function os () {
	if [ "$(uname)" == 'Darwin' ]; then
  		os = 'macOS'
	elif [ "$(expr substr $(uname -s) 1 5)" == 'Linux' ]; then
  		os = 'Linux'
	elif [ "$(expr substr $(uname -s) 1 10)" == 'MINGW32_NT' ]; then                                                                                           
  		os = 'Windows'
	else
  		echo "Your platform ($(uname -a)) is not supported."
  		exit 1
	fi

	return OS
}



function installationCheck () {




	## Check node_modules
	if [ -e $HOME_DIR/.npm/jade/ ]; then
		echo "Jade is already installed."
	else 
		npm install -g jade
	fi

	if [ -e $HOME_DIR/.npm/node-sass/ ]; then
		echo "node-sass is already installed."
	else
		npm install -g node-sass
	fi

	if [ -e $HOME_DIR/.npm/typescript/ ]; then
		echo "TypeScript is already installed."
	else
		npm install -g typescript
	fi
}




function main () {

}


main 