#!/bin/sh

version=$1

docker build -t ${hub}/alpha_supsys/github-markdown-notebook:${version} .