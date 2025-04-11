#!/bin/bash 

VERSION=$(node -p "require('./package.json').version")

git tag "v$VERSION"
git push origin "v$VERSION"
