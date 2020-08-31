import sys
import tensorflow as tf
from tensorflow import keras
import json
import numpy as np
import re


def create_model():
    model = tf.keras.Sequential([
        keras.layers.Dense(2100, activation='relu', input_shape=(210,)),
        # keras.layers.Dropout(0.5),
        keras.layers.Dense(210, activation='relu'),
        # keras.layers.Dropout(0.5),
        keras.layers.Dense(3, activation='softmax')
    ])
    model.compile(optimizer="sgd",
                  loss="binary_crossentropy",
                  metrics=[keras.metrics.Precision(), keras.metrics.Recall(), 'accuracy'])

    # model.compile(optimizer='adam',
    #          loss='sparse_categorical_crossentropy',
    #          metrics=['accuracy'])

    return model




#Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    #print(lines)
    # Since our input would only be having one line, parse our JSON data from that
    #return json.loads(lines[0])
def main():
    #print("123")
    #print ("\n".join(sys.argv))
   
    #print("Output from Python")

    #print("First name: " + sys.argv[1])

    #print("Last name: " + sys.argv[2]) 
    
    #get our data as an array from read_in()
    #lines = read_in()
    # Sum  of all the items in the providen array
    #total_sum_inArray = 0
    #print(lines)
    #print(lines[1])

    
    #model.summary()
    temp = np.asarray(sys.argv)
    temp2 = temp[1:211]
    #print(len(temp2))
    #print(temp[0])
    scriptName = ""
    match = re.search('/.+?/', temp[0])
    if match: 
    #    print(match[0])
        scriptName = match[0]
        scriptName= scriptName[1: len(scriptName)-1]
        #print(scriptName)
    #else: print("not found")

    temp3 = np.float32(temp2)
    
    neuroData = (np.expand_dims(temp3,0))

    model = create_model()
    
    #model.load_weights("./neuro/"+scriptName+"/model/cp.ckpt")
    model.load_weights("/home/administrator/test/gekko0419-git/neuro/tVStratNeuroAll/model/cp.ckpt")

    predictions = model.predict(neuroData)
    out = '{"prediction":"'+str(predictions)+'",'
    #print('{"prediction":"'+str(predictions)+'"}')
    outPred = '"action":0}'
    if predictions[0][1] > 0.5:
        outPred= '"action":'+'-'+str(predictions[0][1])+'}'
        #print("action -"+str(predictions[0][1]))
    #down
    if predictions[0][2] > 0.5:
        outPred= '"action":'+str(predictions[0][2])+'}'
     #   print("action "+str(predictions[0][2]))
    print(out+outPred)
    #for item in lines:
    #    total_sum_inArray += item
        #return the sum to the output stream
    #print("Proot! "+str(total_sum_inArray))
# Start process
if __name__ == '__main__':
    main()
