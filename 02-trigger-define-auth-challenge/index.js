let response;

exports.handler = async (event, context) => {
    console.log("Started...");
    console.log(event);
    console.log(event.request.session);

    try {
        
        if (event.request.session &&
            event.request.session.find(attempt => attempt.challengeName !== 'CUSTOM_CHALLENGE')) {
            console.log("Step 4");
            // We only accept custom challenges; fail auth
            event.response.issueTokens = false;
            event.response.failAuthentication = true;
        } else if (event.request.session &&
            event.request.session.length >= 3 &&
            event.request.session.slice(-1)[0].challengeResult === false) {
            console.log("Step 3");
            // The user provided a wrong answer 3 times; fail auth
            event.response.issueTokens = false;
            event.response.failAuthentication = true;
        } else if (event.request.session &&
            event.request.session.length &&
            event.request.session.slice(-1)[0].challengeName === 'CUSTOM_CHALLENGE' && // Doubly stitched, holds better
            event.request.session.slice(-1)[0].challengeResult === true) {
            console.log("Step 2");
            // The user provided the right answer; succeed auth
            event.response.issueTokens = true;
            event.response.failAuthentication = false;
        } else {
            console.log("Step 1");
            // The user did not provide a correct answer yet; present challenge
            event.response.issueTokens = false;
            event.response.failAuthentication = false;
            event.response.challengeName = 'CUSTOM_CHALLENGE';
        }    
        
        
    } catch (err) {
        console.log(err);
        throw err;
    }

    return event;
};
