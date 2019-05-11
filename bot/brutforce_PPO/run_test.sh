#!/bin/bash
#node gekko --config test_stochRSI.js --backtest | grep 'simulated profit' > log.txt

test_name=PPO

NEW_RANDOM=0
RESULT=0
GOOD_TRY=0
OLD_RESULT=0
MAX_RESULT=0

X1_MAX=0
X2_MAX=0
Y1_MAX=0
Y2_MAX=0
Y3_MAX=0
Y4_MAX=0
Y5_MAX=0

X1_BEST=0
X2_BEST=0
Y1_BEST=0
Y2_BEST=0
Y3_BEST=0
Y4_BEST=0
Y5_BEST=0

X1_low=1
X1_hi=10

X2_low=1
X2_hi=60

Y1_low=1
Y1_hi=100

Y2_low=1
Y2_hi=100

Y3_low=1
Y3_hi=100

Y4_low=1
Y4_hi=100

Y5_low=1
Y5_hi=100

#defaults

X1=5 #candleSize 5
X2=10 #historySize

Y1=106 #short
Y2=26 #long
Y3=94 #signal
Y4=0.01 #thresholds
Y5=6 #persistence



###########################################################################################


function fGenerate_new_data {

if [ $NEW_RANDOM -eq 1 ] ; then
    echo 'New random'
	X1=$(($X1_low + RANDOM%$(($X1_hi-$X1_low))))
	X2=$(($X2_low + RANDOM%$(($X2_hi-$X2_low))))
	Y1=$(($Y1_low + RANDOM%$(($Y1_hi-$Y1_low))))
	Y2=$(($Y2_low + RANDOM%$(($Y2_hi-$Y2_low))))
	Y3=$(($Y3_low + RANDOM%$(($Y3_hi-$Y3_low))))
	Y4=$(($Y4_low + RANDOM%$(($Y4_hi-$Y4_low))))
	Y4=$(echo "scale=10; $Y4/1000" |bc)
	Y5=$(($Y5_low + RANDOM%$(($Y5_hi-$Y5_low))))

fi
echo "###############################################"
echo x1 $X1
echo x2 $X2
echo y1 $Y1
echo y2 $Y2
echo y3 $Y3
echo y4 $Y4
echo y5 $Y5

cp test_strategy_init.js ../../"$test_name"_test_strategy_run.js

if [[ $X1 -lt $X1_low ]]; then X1=$X1_low 
fi
if [[ $X2 -lt $X2_low ]]; then X1=$X2_low 
fi
if [[ $Y1 -lt $Y1_low ]]; then Y1=$Y1_low 
fi
if [[ $Y2 -lt $Y2_low ]]; then Y1=$Y2_low 
fi
if [[ $Y3 -lt $Y3_low ]]; then Y3=$Y3_low 
fi
if [ $(echo "$Y4*1000 < $Y4_low" | bc) -eq 1 ]; then Y4=$Y4_low
fi
if [[ $Y5 -lt $Y5_low ]]; then Y5=$Y5_low 
fi


sed  -i "s/XXX1/$X1/g" ../../"$test_name"_test_strategy_run.js
sed  -i "s/XXX2/$X2/g" ../../"$test_name"_test_strategy_run.js
sed  -i "s/YYY1/$Y1/g" ../../"$test_name"_test_strategy_run.js
sed  -i "s/YYY2/$Y2/g" ../../"$test_name"_test_strategy_run.js
sed  -i "s/YYY3/$Y3/g" ../../"$test_name"_test_strategy_run.js
sed  -i "s/YYY4/$Y4/g" ../../"$test_name"_test_strategy_run.js
sed  -i "s/YYY5/$Y5/g" ../../"$test_name"_test_strategy_run.js

}

function fParce_result {
	RESULT=$(sed 's/^.*ETH (//' ./"$test_name"_log.txt | sed 's/%)//')
#TODO если нет результата то выдать 0.
#	if [[ $RESULT -lt 0 ]]; then RESULT = 1
#	fi
#	if [ $(echo "$RESULT = null" | bc) -eq 1 ]; then
#	RESULT=0
#	fi

	echo Profit $RESULT %
}


function fRun_test {
echo Run test
	node ../../gekko --config "$test_name"_test_strategy_run.js --backtest | grep '(PROFIT REPORT) profit:' > "$test_name"_log.txt
	fParce_result
}


function fCompare_result {

if [ $(echo "$RESULT >= $MAX_RESULT" | bc) -eq 1 ]; then	
	    echo "yes"
		#GOOD_TRY=1		
		MAX_RESULT=$RESULT
		X1_MAX=$X1
		X2_MAX=$X2
		Y1_MAX=$Y1
		Y2_MAX=$Y2
		Y3_MAX=$Y3
		Y4_MAX=$Y4
		Y5_MAX=$Y5
		echo Profit $RESULT % >> "$test_name"_result.log
		echo x1 $X1 >> "$test_name"_result.log
		echo x2 $X2 >> "$test_name"_result.log
		echo short = $Y1 >> "$test_name"_result.log
		echo long =  $Y2 >> "$test_name"_result.log
		echo signal =  $Y3 >> "$test_name"_result.log
		echo [thresholds] >> "$test_name"_result.log
		echo down =  -$Y4 >> "$test_name"_result.log
		echo up = $Y4 >> "$test_name"_result.log
		echo persistence =  $Y5 >> "$test_name"_result.log
		echo     >> "$test_name"_result.log
	#else 
	    	#echo "no"

	fi

if [ $(echo "$RESULT > $OLD_RESULT" | bc) -eq 1 ]; then	
	    echo "yes"
		GOOD_TRY=1		
		OLD_RESULT=$RESULT
		X1_MAX=$X1
		X2_MAX=$X2
		Y1_MAX=$Y1
		Y2_MAX=$Y2
		Y3_MAX=$Y3
		Y4_MAX=$Y4
		Y5_MAX=$Y5
	else 
	    echo "no"
		GOOD_TRY=0
	fi

}



function fTest {
NEW_RANDOM=0
#X1
	GOOD_TRY=1
	while [ $GOOD_TRY -eq 1 ]
		do
		X1=$(($X1_MAX-1))
		fGenerate_new_data
		fRun_test
	 	fCompare_result
		X1=$X1_MAX #return data
		done

	GOOD_TRY=1
	while [ $GOOD_TRY -eq 1 ]
		do
		X1=$(($X1_MAX+1))
		fGenerate_new_data
		fRun_test
	 	fCompare_result
		X1=$X1_MAX #return data
		done
#X2
	GOOD_TRY=1
	while [ $GOOD_TRY -eq 1 ]
		do
		X2=$(($X2_MAX-1))
		fGenerate_new_data
		fRun_test
	 	fCompare_result
		X2=$X2_MAX #return data
		done

	GOOD_TRY=1
	while [ $GOOD_TRY -eq 1 ]
		do
		X2=$(($X2_MAX+1))
		fGenerate_new_data
		fRun_test
	 	fCompare_result
		X2=$X2_MAX #return data
		done

#Y1
	GOOD_TRY=1
	while [ $GOOD_TRY -eq 1 ]
		do
		Y1=$(($Y1_MAX-1))
		fGenerate_new_data
		fRun_test
	 	fCompare_result
		Y1=$Y1_MAX #return data
		done

	GOOD_TRY=1
	while [ $GOOD_TRY -eq 1 ]
		do
		Y1=$(($Y1_MAX+1))
		fGenerate_new_data
		fRun_test
	 	fCompare_result
		Y1=$Y1_MAX #return data
		done

#Y2
	GOOD_TRY=1
	while [ $GOOD_TRY -eq 1 ]
		do
		Y2=$(($Y2_MAX-1))
		fGenerate_new_data
		fRun_test
	 	fCompare_result
		Y2=$Y2_MAX #return data
		done

	GOOD_TRY=1
	while [ $GOOD_TRY -eq 1 ]
		do
		Y2=$(($Y2_MAX+1))
		fGenerate_new_data
		fRun_test
	 	fCompare_result
		Y2=$Y2_MAX #return data
		done

#Y3
	GOOD_TRY=1
	while [ $GOOD_TRY -eq 1 ]
		do
		Y3=$(($Y3_MAX-1))
		fGenerate_new_data
		fRun_test
	 	fCompare_result
		Y3=$Y3_MAX #return data
		done

	GOOD_TRY=1
	while [ $GOOD_TRY -eq 1 ]
		do
		Y3=$(($Y3_MAX+1))
		fGenerate_new_data
		fRun_test
	 	fCompare_result
		Y3=$Y3_MAX #return data
		done

#Y4
	GOOD_TRY=1
	while [ $GOOD_TRY -eq 1 ]
		do
		Y4=$(echo "$Y4_MAX-0.01"|bc)
		fGenerate_new_data
		fRun_test
	 	fCompare_result
		Y4=$Y4_MAX #return data
		done

	GOOD_TRY=1
	while [ $GOOD_TRY -eq 1 ]
		do
		Y4=$(echo "$Y4_MAX+0.01"|bc)
		fGenerate_new_data
		fRun_test
	 	fCompare_result
		Y4=$Y4_MAX #return data
		done

#Y5
	GOOD_TRY=1
	while [ $GOOD_TRY -eq 1 ]
		do
		Y5=$(($Y5_MAX-1))
		fGenerate_new_data
		fRun_test
	 	fCompare_result
		Y5=$Y5_MAX #return data
		done

	GOOD_TRY=1
	while [ $GOOD_TRY -eq 1 ]
		do
		Y5=$(($Y5_MAX+1))
		fGenerate_new_data
		fRun_test
	 	fCompare_result
		Y5=$Y5_MAX #return data
		done

	#OLD_RESULT=$RESULT
	#echo $OLD_RESULT


#	fGenerate_new_data


#	echo $X1


}


function fStart_test {

#first etalon run





count=0

while [ $count -lt 10 ]
do
#(( count++ ))
#echo $count

NEW_RANDOM=1

fGenerate_new_data
fRun_test
fCompare_result

X1_MAX=$X1
X2_MAX=$X2
Y1_MAX=$Y1
Y2_MAX=$Y2
Y3_MAX=$Y3
Y4_MAX=$Y4
Y5_MAX=$Y5

OLD_RESULT=$RESULT

fTest

done

}


fStart_test


echo $X1


