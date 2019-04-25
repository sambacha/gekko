#!/bin/bash

sed -n 's/PROFIT REPORT//p' ./*log.txt > profit_report.txt
nano profit_report.txt
