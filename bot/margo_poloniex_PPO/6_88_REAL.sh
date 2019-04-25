#!/bin/bash




X1=6 #candleSize
X2=10 #historySize

Y1=88 #short 
Y2=20 #long
Y3=3 #signal 
Y4=0.038 #thresholds 
Y5=15 #persistence 

PAPERTRADER=false
REALTRADER=true
PTREAL=realM

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
	echo node ../../gekko --config "$test_name"_gekko_strategy.js' &> '"$test_name".log.txt > temp_run_$test_name.sh

	screen -S $test_name bash temp_run_$test_name.sh 

}


#fStart_test
fGenerate_new_data
fRun_test



