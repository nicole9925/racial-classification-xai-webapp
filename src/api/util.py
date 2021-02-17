import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from PIL import Image
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense, BatchNormalization, Conv2D, MaxPooling2D, Flatten
from tensorflow.keras.layers import Activation, Dropout, Lambda, Dense
from tensorflow.keras import Sequential
from IntegratedGradients import *
import json
from tensorflow import keras
#from tensorflow.keras.applications.xception import preprocess_input
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from PIL import Image
from tensorflow.keras.applications import resnet_v2
from sklearn.metrics import classification_report
from sklearn.metrics import confusion_matrix
import seaborn as sns
import matplotlib.pyplot as plt
import io


"""
Function to create generator from the csv file
input
    csv_path: path to the csv file
    image_path: path to the image directory
    target: the class of interest(age, gender, or race)
    size: the size of the image
    batch_size: the batch size
    preprocess_input: The preprocess function to apply based on different transfer learning model. Make sure to change
    the import statement above if wants to apply different transfer learning model
    mapping_path: a directionary objects indicating how each category is being mapped to the respective integer representation
    is_training: whether or not the generator is used as training

output
    a generator object ready to be trained
"""
def create_generator(csv_path, image_path, target, size, batch_size, mapping_path, preprocess_input, is_training):
    
    if is_training:
        rotation_range = 30
        horizontal_flip = True
        vertical_flip = True
        shuffle = True
    else:
        rotation_range = 0
        horizontal_flip = False
        vertical_flip = False
        shuffle = False
    
    df = pd.read_csv(csv_path)
    df["file"] = df["file"].apply(lambda x: os.path.join(image_path, x.split("/")[1]))
    
    imgdatagen = ImageDataGenerator(
        preprocessing_function = preprocess_input,
        rotation_range = rotation_range,
        horizontal_flip = horizontal_flip, 
        vertical_flip = vertical_flip,
        #rescale = 1.0 / 255
    )
    
    data_generator = imgdatagen.flow_from_dataframe(
        dataframe = df,
        directory = None,
        x_col = "file",
        y_col = target,
        target_size = (size, size),
        batch_size = batch_size,
        save_format = "jpg",
        shuffle = shuffle
    )
    
    with open(mapping_path, "w") as f:
        json.dump(data_generator.class_indices, f)
    f.close()
    
    return data_generator
    

"""
function to visualize the training progress
input
    log_path: The csv file that logged the training progress
    target: the name of the class (e.g. age, race, gender)
output
    the accuray and loss curve for both the training and validation
"""
def generate_curves(log_path, save_path):
    
    if not os.path.exists(save_path):
        os.mkdir(save_path)
       
    df = pd.read_csv(log_path)
    path_to_viz = save_path
    acc_name = os.path.join(path_to_viz, "acc_curve")
    loss_name = os.path.join(path_to_viz, "loss_curve")
    
    ax = plt.gca()
    plt.plot(df["accuracy"])
    plt.plot(df["val_accuracy"])
    plt.title("Training Accuracy vs. Validation Accuracy")
    plt.xlabel("epochs")
    plt.ylabel("Accuracy")
    ax.legend(['Train','Validation'],loc='lower right')
    plt.savefig(acc_name)
    plt.close()
    
    ax = plt.gca()
    plt.plot(df["loss"])
    plt.plot(df["val_loss"])
    plt.title("Training loss vs. Validation loss")
    plt.xlabel("epochs")
    plt.ylabel("Loss")
    ax.legend(['Train','Validation'],loc='upper right')
    plt.savefig(loss_name)
    

"""
Function to evaluate the model by calculating category-specific statistics
input
    model: a loaded model
    generator: a generator that contains data
    label_df: the csv file that contains the information of the data
    target: the name of the class (e.g. age, race, gender)
    target_map: The mapping of the class
    save_path: where the plot should be saved
output
    The class-specific barplot for precision, recall, f1-score, accuracy, and support
"""
def create_stats(model, generator, target, label_path, mapping_path, save_path):
    
    if not os.path.exists(save_path):
        os.mkdir(save_path)
    
    label_df = pd.read_csv(label_path)
    with open(mapping_path) as f:
        target_map = json.load(f)
    f.close()
    
    pred = model.predict(generator).argmax(axis = 1)
    ground_truth = label_df[target].replace(target_map).values
    cr = classification_report(ground_truth, pred, target_names = target_map.keys())
    
    with open(os.path.join(save_path, "class_report.txt"), "w") as f:
        f.write(cr)
    f.close()
    
    cr = classification_report(ground_truth, pred, target_names = target_map.keys(), output_dict = True)
    
    result_df = pd.DataFrame(cr).T.iloc[:len(target_map), :]
    result_df = result_df.reset_index().rename(columns= {"index": "category"})

    cm = confusion_matrix(ground_truth, pred)
    cm = cm.astype('float') / cm.sum(axis=1)[:, np.newaxis]
    acc = cm.diagonal()
    result_df["accuracy"] = acc
    
    stat_names = ["precision", "recall", "f1-score", "accuracy", "support"]
    
    for name in stat_names:
        save_dir = os.path.join(save_path, name + "_barplot")
        plt.figure(figsize = (12,8))
        sns.barplot(x = "category", y= name, data= result_df,linewidth=2.5, 
                    facecolor=(1, 1, 1, 0), edgecolor="0")
        plt.title("{} across {}".format(name, target), fontsize = 20)
        plt.xlabel(target, fontsize = 16)
        plt.ylabel(name, fontsize= 16)
        plt.savefig(save_dir)  

"""
function to get the prediction from the model
input
    img_path: The path to the image
    model_path: The path to the model
    mapping_path: The mapping
out
    The prediction made by the model
"""

"""
function to make a single prediction of an image
input
    img_path: The path to the image
    model_path: The path to the model
    mapping_path: The mapping between labels(in number) and categories
    result_df_path: The aggregate results
output
    out: The prediction
    pred_prob: The accuracy of making the out prediction
    aggregate_acc: The accuracy of the aggregate category

***NOTE: result_df_path can be found in(assuming race):
    "./visualization/race/stats/result_df.csv"
"""
def get_prediction(img_path, model_path, mapping_path, result_df_path):
    img_arr = detect_face(img_path)
    if img_arr.shape != (1, 224,224,3):
        print("Wrong input size")
        return
    else:
        model = keras.models.load_model(model_path)
        
        with open(mapping_path) as f:
            mapping = json.load(f)
        f.close()
        mapping = {val:key for key, val in mapping.items()}
        pred = model.predict(img_arr).squeeze()
        out = mapping[pred.argmax()]
        pred_prob = np.round(pred[pred.argmax()] * 100, 4)
        
        result_df = pd.read_csv(result_df_path)
        aggregate_acc = np.round(result_df[result_df["category"] == out]["accuracy"].values[0] * 100, 4)
    
    return out, pred_prob, aggregate_acc

"""
Convert a Matplotlib figure to a PIL Image and return it
"""
def fig2img(fig):
    buf = io.BytesIO()
    fig.savefig(buf)
    buf.seek(0)
    img = Image.open(buf)
    return img

"""
Function similar to integrated_grad_pic but just do it on one image

modification: the returned output is an image. This function no longer save the image into jpg.

in: 
    model_param_path: saved model in .hdf5 format
    mapping: The dictionary object of the mapping between labels and category
    target: The target(e.g. race, age, gender)
    image_path: The path to the image
out:
    a single image of object PIL.PngImage
"""
def integrated_grad_pic_single(model_param_path, mapping, target, image_path):
    
    model = keras.models.load_model(model_param_path)
    ig = integrated_gradients(model)
    
    with open(mapping) as f:
        mapping_dict = json.load(f)
    f.close()
    
    mapping_dict = {val:key for key, val in mapping_dict.items()}
    
    max_iter_range = len(mapping_dict)
    if target == "age" or target == "race":
        subplot_row = 3
        subplot_col = 3
    else:
        subplot_row = 1
        subplot_col = 2
    
    
    processed_image = resnet_v2.preprocess_input(plt.imread(image_path)).reshape(-1, size, size, 3)

    exs = []
    output_prob = model.predict(processed_image).squeeze()
    for i in range(1, max_iter_range + 1):
        exs.append(ig.explain(processed_image.squeeze(), outc=i-1))
    exs = np.array(exs)

    # Plot them
    th = max(np.abs(np.min(exs)), np.abs(np.max(exs)))

    fig = plt.subplots(subplot_row, subplot_col,figsize=(15,15))
    for i in range(max_iter_range):
        ex = exs[i]
        plt.subplot(subplot_row,subplot_col,i+1)
        plt.imshow(ex[:,:,0], cmap="seismic", vmin=-1*th, vmax=th)
        plt.xticks([],[])
        plt.yticks([],[])
        plt.title("heatmap for {} {} with probability {:.2f}".format(target, mapping_dict[i],output_prob[i]), 
                  fontsize=10)
    plt.tight_layout()
    fig = plt.gcf()
    plt.close()
    img = fig2img(fig)
    return img
             

    
