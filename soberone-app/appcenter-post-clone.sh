#!/usr/bin/env bash

# Switch to Java 11
echo "Switching to Java 11"
brew tap AdoptOpenJDK/openjdk
brew install --cask adoptopenjdk11
export JAVA_HOME=/Library/Java/JavaVirtualMachines/adoptopenjdk-11.jdk/Contents/Home
export PATH=$JAVA_HOME/bin:$PATH
java -version
