const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();

//Create an instance of the firestore
const Firestore = admin.firestore;

//get instace of our data base
const db = Firestore();


// Call axios for  http request
const axios = require("axios");


const cors = require("cors")({
    origin: true
});


const googleMapsApiKey = "AIzaSyCpXRhDjJhzU-ffxgMdD9-1R8TgkkDuKPk";


exports.criminalGetLocation = functions.https.onRequest(async (request, response) => {

    try {
        let criminalAdress = encodeURI(request.body.address);
        let { data } = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${criminalAdress}&key=${googleMapsApiKey}`);
        if (data.status !== "OK") {
            //no results
            return cors(request, response, () => {
                response.status(200).send("No Results");
            });
        }
        const geocodedLocation = data.results[0];
        const objGeolocation = {
            address: geocodedLocation.formatted_address,
            geoPoint: new admin.firestore.GeoPoint(geocodedLocation.geometry.location.lat, geocodedLocation.geometry.location.lng)
        }


        return cors(request, response, () => {
            response.status(200).send(objGeolocation);
        });

    } catch (error) {
        return cors(request, response, () => {
            console.log(error);
            response.status(500).send();
        });
    }
});


exports.userInformartionTest = functions.https.onRequest(async (request, response) => {


    try {
        let userID = encodeURI(request.body.userID);
        let userData = encodeURI(request.body.usuario);

        if (userID === undefined && userData === undefined) {
            //no results
            return cors(request, response, () => {
                response.status(200).send("No Results: ");
            });
        }

        let objGeolocation = {
            user: userID,
            correo: userData,
        }

        await db.collection('user').add(objGeolocation);
        return cors(request, response, () => {
            response.status(200).send(objGeolocation);
        });

    } catch (error) {
        return cors(request, response, () => {
            console.log(error + "userdata : " + userdata);
            response.status(500).send(userdata);
        });
    }
});

exports.criminalFormData = functions.https.onRequest(async (request, response) => {

    try {
        let descripcion = request.body.descripcion;
        let fecha = request.body.fecha;
        let hora = request.body.hora;
        let status = request.body.status;
        let referencia = request.body.referencia;
        let latitude = request.body.latitude;
        let longitude = request.body.longitude;
        let userid = request.body.currentUserID;
        let typeCrime = request.body.typeCrime;
        let typeSex = request.body.typeSex;

        if (
            descripcion === undefined ||
            fecha === undefined ||
            hora === undefined ||
            status === undefined ||
            referencia === undefined ||
            userid === undefined
        ) {
            //no results
            return cors(request, response, () => {
                response.status(200).send("No Results");
            });
        }

        let criminaldata = {
            descripcion: descripcion,
            fecha: fecha,
            hora: hora,
            estatus: status,
            tipoCrimen: typeCrime,
            tipoSexo: typeSex,
            referencia: referencia,
            geoPoint: {
                latitude,
                longitude
            }
        }

        let res;

        if (typeCrime !== "secuestro") {
            res = await db.collection('criminalInfo').add(criminaldata);
        } else {
            res = await db.collection('lostPersondata').add(criminaldata);
        }


        console.log(res.id)
        let criminalID = res.id;

        //we are going to check is the user exist on the data base 
        const userRef = db.collection("userCriminalInfo").doc(userid);
        userRef.get().then(async (docSnapshot) => {
            if (docSnapshot.exists) {
                console.log("existe!");
                userRef
                    .update({
                        criminalsID: admin.firestore.FieldValue.arrayUnion(criminalID),
                        timestamp: admin.firestore.FieldValue.serverTimestamp(),
                    })
                    .then(() => {
                        console.log("Document successfully updated!");
                    })
                    .catch((error) => {
                        // The document probably doesn't exist.
                        console.error("Error updating document: ", error);
                        return cors(request, response, () => {
                            response.status(200).send("UPDATE_ERROR");
                        });
                    });
            } else {
                console.log("no existe!");
                let data = {
                    criminalsID: [criminalID]
                }
                const newUser = await db
                    .collection("userCriminalInfo")
                    .doc(userid).set(data);
            }
        });

        return cors(request, response, () => {
            response.status(200).send(criminalID);
        });
    } catch (error) {
        return cors(request, response, () => {
            console.log(error);
            response.status(500).send(criminaldata);
        });
    }
});


exports.criminalMapInfo = functions.https.onRequest(async (request, response) => {

    try {

        const criminalSnap = await db.collection("criminalInfo").get();
        const userSnap = await db.collection("user").get();
       

        let criminalData = {
            location: [],
            id: [],
            userIds: [],
        }
        if (criminalSnap.empty) {
            //no results
            return cors(request, response, () => {
                response.status(200).send("NO RESULTS");
            });
        }

        //save the data of the criminals in a que
        criminalSnap.docs.forEach((doc) => {
            criminalData.location.push(doc.data());
            criminalData.id.push(doc.id);
        });
        
        userSnap.docs.forEach((doc) => {
            criminalData.userIds.push(doc.id)
        });

        return cors(request, response, () => {
            response.status(200).send(criminalData);
        });

    } catch (error) {
        return cors(request, response, () => {
            console.log(error);
            response.status(500).send();
        });
    }
});

exports.lostPersonMapInfo = functions.https.onRequest(async (request, response) => {//remover

    try {

        const criminalSnap = await db.collection("lostPersondata").get();
        let savedLocations = [];
        if (criminalSnap.empty) {
            //no results
            return cors(request, response, () => {
                response.status(200).send("NO RESULTS");
            });
        }

        //save the data of the criminals in a que
        criminalSnap.docs.forEach((doc) => {
            savedLocations.push(doc.data());
        });

        return cors(request, response, () => {
            response.status(200).send(savedLocations);
        });

    } catch (error) {
        return cors(request, response, () => {
            console.log(error);
            response.status(500).send();
        });
    }
});


exports.userCriminalInfo = functions.https.onRequest(async (request, response) => {

    try {

        const userCriminalSnap = await db.collection("userCriminalInfo").get();
        const userSnap = await db.collection("user").get();

        let totalReportUser = [];
        let ids = [];
        let regCriminals = 0;
        let userID;
        let userStar;
        let totalUsers = 0;

        userCriminalSnap.docs.forEach((doc) => {
            totalReportUser.push(doc.data());
            ids.push(doc.id);
        });

        for (let index = 0; index < totalReportUser.length; index++) {
            let tempCriminalUserArray = totalReportUser[index];
            if (tempCriminalUserArray.criminalsID.length > regCriminals) {
                regCriminals = tempCriminalUserArray.criminalsID.length;
                userID = ids[index];
            }
        }

        userSnap.docs.forEach((doc) => {
            if (userID === doc.id) {
                userStar = doc.data().nick;
            }
            totalUsers++;
        });

        return cors(request, response, () => {
            response.status(200).send({ userID, regCriminals, userStar, totalUsers });
        });

    } catch (error) {
        return cors(request, response, () => {
            console.log(error);
            response.status(500).send();
        });
    }
});



exports.userCriminalRatings = functions.https.onRequest(async (request, response) => {

    try {
        let reportId = request.body.reportId;
        let userCriminalReportState = request.body.userReportState;
        let userId = request.body.userId;

        let key = false;
        const userRef = db.collection("userCriminalRatings").doc(userId);
        userRef.get().then(async (docSnapshot) => {
            if (docSnapshot.exists) {
                if (docSnapshot.data().criminalsID.length > 0) {
                    let tempData = docSnapshot.data();
                    for (let index = 0; index < tempData.criminalsID.length; index++) {
                        if (tempData.criminalsID[index].id == reportId) {
                            key = true;
                            if (tempData.criminalsID[index].rating == userCriminalReportState) {
                                return cors(request, response, () => {
                                    response.status(200).send("SAME");
                                });
                            } else {
                                tempData.criminalsID[index].rating = userCriminalReportState;

                                tempData.criminalsID[index].dislike = userCriminalReportState
                                    ? tempData.criminalsID[index].dislike - 1
                                    : tempData.criminalsID[index].dislike + 1;

                                tempData.criminalsID[index].like = userCriminalReportState
                                    ? tempData.criminalsID[index].like + 1
                                    : tempData.criminalsID[index].like - 1;
                                userRef
                                    .update({
                                        criminalsID: tempData.criminalsID,
                                    })
                                    .then(async function () {
                                        console.log("update input not the same: ");
                                        return cors(request, response, () => {
                                            response.status(200).send("UPDATE NOT SAME");
                                        });
                                    });
                            }
                        }
                    }
                }
                if (!this.key) {
                    userRef
                        .update({
                            criminalsID: admin.firestore.FieldValue.arrayUnion({
                                id: reportId,
                                like: userCriminalReportState ? 1 : 0,
                                dislike: userCriminalReportState ? 0 : 1,
                                rating: userCriminalReportState,
                            }),
                        })
                        .then(async function () {
                            console.log("agregar reporte no  existe: ");
                            return cors(request, response, () => {
                                response.status(200).send("USER REPORT ADDED");
                            });
                        });
                }
            } else {
                let criminalsID = {
                    id: reportId,
                    like: userCriminalReportState ? 1 : 0,
                    dislike: userCriminalReportState ? 0 : 1,
                    rating: userCriminalReportState,
                };
                let data = {
                    criminalsID: [criminalsID],
                };
                console.log("creando nuevo usuario rating");
                const newUser = await db
                    .collection("userCriminalRatings")
                    .doc(userId)
                    .set(data);
            }
        });

        return cors(request, response, () => {
            response.status(200).send("NEW USER REPORT");
        });


    } catch (error) {
        return cors(request, response, () => {
            console.log(error);
            response.status(500).send();
        });
    }
});
