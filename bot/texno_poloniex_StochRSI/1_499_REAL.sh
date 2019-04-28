#!/bin/bash




X1=1 #candleSize 5
X2=10 #historySize

Y1=499 #interval
Y2=33 #thresholds low
Y3=74 #thresholds high
Y4=42 #thresholds persistence

PAPERTRADER=false
REALTRADER=true
PTREAL=REAL

test_name=StochRSI_$X1-$Y1-REAL


###########################################################################################


function fGenerate_new_data {

echo -n x1 $X1 x2 $X2 y1 $Y1 y2 $Y2 y3 $Y3 y4 $Y4 " "

cp gekko_strategy_init.js ../../"$test_name"_gekko_strategy.js

sed  -i "s/XXX1/$X1/g" ../../"$test_name"_gekko_strategy.js
sed  -i "s/XXX2/$X2/g" ../../"$test_name"_gekko_strategy.js
sed  -i "s/YYY1/$Y1/g" ../../"$test_name"_gekko_strategy.js
sed  -i "s/YYY2/$Y2/g" ../../"$test_name"_gekko_strategy.js
sed  -i "s/YYY3/$Y3/g" ../../"$test_name"_gekko_strategy.js
sed  -i "s/YYY4/$Y4/g" ../../"$test_name"_gekko_strategy.js
sed  -i "s/PAPERTRADER/$PAPERTRADER/g" ../../"$test_name"_gekko_strategy.js
sed  -i "s/REALTRADER/$REALTRADER/g" ../../"$test_name"_gekko_strategy.js
sed  -i "s/PTREAL/$PTREAL/g" ../../"$test_name"_gekko_strategy.js

}


function fRun_test {
	echo node ../../gekko --config "$test_name"_gekko_strategy.js' > '"$test_name"-$PTREAL.log.txt > temp_run_$X1-$Y1.sh

	screen -S $X1-$Y1-$PTREAL bash temp_run_$X1-$Y1.sh 

}


#fStart_test
fGenerate_new_data
fRun_test



