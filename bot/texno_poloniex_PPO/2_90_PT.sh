#!/bin/bash




X1=2 #candleSize
X2=10 #historySize

Y1=90 #short 
Y2=39 #long
Y3=39 #signal 
Y4=0.08 #thresholds 
Y5=92 #persistence 

PAPERTRADER=true
REALTRADER=false
PTREAL=PT

test_name=PPO_$X1-$Y1-$PTREAL


###########################################################################################


function fGenerate_new_data {

echo -n x1 $X1 x2 $X2 y1 $Y1 y2 $Y2 y3 $Y3 y4 $Y4 y5 $Y5 " "

cp gekko_strategy_init.js ../../"$test_name"_gekko_strategy.js

sed  -i "s/XXX1/$X1/g" ../../"$test_name"_gekko_strategy.js
sed  -i "s/XXX2/$X2/g" ../../"$test_name"_gekko_strategy.js
sed  -i "s/YYY1/$Y1/g" ../../"$test_name"_gekko_strategy.js
sed  -i "s/YYY2/$Y2/g" ../../"$test_name"_gekko_strategy.js
sed  -i "s/YYY3/$Y3/g" ../../"$test_name"_gekko_strategy.js
sed  -i "s/YYY4/$Y4/g" ../../"$test_name"_gekko_strategy.js
sed  -i "s/YYY5/$Y5/g" ../../"$test_name"_gekko_strategy.js
sed  -i "s/PAPERTRADER/$PAPERTRADER/g" ../../"$test_name"_gekko_strategy.js
sed  -i "s/REALTRADER/$REALTRADER/g" ../../"$test_name"_gekko_strategy.js
sed  -i "s/PTREAL/$PTREAL/g" ../../"$test_name"_gekko_strategy.js

}


function fRun_test {
	echo node ../../gekko --config "$test_name"_gekko_strategy.js' &> '"$test_name"-$PTREAL.log.txt > temp_run_$X1-$X2.sh

	screen -S $X1-$Y1-$PTREAL bash temp_run_$X1-$Y1.sh 

}


#fStart_test
fGenerate_new_data
fRun_test



