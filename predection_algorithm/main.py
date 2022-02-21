import requests
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingRegressor

URL = "http://localhost:3000"
limit = "300000"
deviceID = "864547036311749"
maxTimeDelta = 90
jsonData = requests.get(URL + "/getFilteredDataByDeviceAPI/" + deviceID + "/" + limit + "/" + str(maxTimeDelta)).text

pd.set_option("display.max_columns", None)
data = pd.read_json(jsonData)
print(data.shape)
print(data.describe())
print(data.head(6))

# Les données d'apprentissage et les données de test (découpage aléatoire)
dataTrain, dataTest = train_test_split(data, train_size=0.9)
print(dataTrain.shape)
print(dataTest.shape)

# isolation des colonnes d'entrées et la colonne cible
xTrain = dataTrain[['currentLat', 'currentLon', 'destinationStation',
                    'speedKPH', 'weekDay', 'currentHour', 'currentMinute']]

yTrain = dataTrain[['timeDelta']]

print(xTrain.head(5))
print(yTrain.head(5))

# modèle GBR
model = GradientBoostingRegressor(random_state=0)

model.fit(xTrain, yTrain)
print("FIN d'APPRENTISSAGE")

# Isolation des entrées/sorties de teste
xTest = dataTest[['currentLat', 'currentLon', 'destinationStation',
                  'speedKPH', 'weekDay', 'currentHour', 'currentMinute']]
yTest = dataTest[['timeDelta']]
print(xTest.head(5))
print(yTest.head(5))

# Test des prédictions
yPred = model.predict(xTest)
prediction = model.predict([
    [30.48492, -9.35111, 1, 16, 1, 8, 59],
    [30.48492, -9.35111, 2, 16, 1, 8, 59],
    [30.48492, -9.35111, 3, 16, 1, 8, 59],
])
print("predection: " + str(prediction))
# Taux de precision des prédictions
print("Taux de precision des prédictions")
score = model.score(xTest, yTest)
print(score)

plt.scatter(yTest, yPred)
plt.xlim(0, maxTimeDelta)
plt.ylim(0, maxTimeDelta)
plt.plot()
score = score*100
plt.title("score = " + str(round(score, 2)) + "%")
plt.xlabel("Observed values (minutes)")
plt.ylabel("Predicted values (minutes)")
plt.show()
