#!/bin/bash

sed -n 's/(INFO)//p' ./*log.txt > info_report.txt
nano info_report.txt
