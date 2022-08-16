exports.handler = async (event, context) => {
    console.log("Started...");
    console.log(event);
    
    var expectedAnswer = event.request.privateChallengeParameters.password; 
    if (event.request.challengeAnswer === expectedAnswer) {
        console.log("Step 1");
        event.response.answerCorrect = true;
    } else {
        console.log("Step 2");
        event.response.answerCorrect = false;
    }
    return event;
};