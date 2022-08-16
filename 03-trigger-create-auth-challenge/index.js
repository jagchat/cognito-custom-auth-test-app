exports.handler = async (event) => {
    console.log("Started...");
    console.log(event);
	var password = "";

	if(!event.request.session || !event.request.session.length) {
	    console.log("Step 1");
		//new session, so fetch password from the db
		//const username = event.request.userAttributes.email;
		//const user = await userModel.findOne({ "username": username});
		//password = user.password;
		password = "testing";
	} else {
	    console.log("Step 2");
	    console.log(event.request.session.slice(-1)[0]);
		// There's an existing session. Don't generate new digits but
		// re-use the code from the current session. This allows the user to
		// make a mistake when keying in the code and to then retry, rather
		// the needing to e-mail the user an all new code again.    
		const previousChallenge = event.request.session.slice(-1)[0];
		password = previousChallenge.challengeMetadata.match(/PASSWORD-(\d*)/)[1];
	}
	// This is sent back to the client app
	event.response.publicChallengeParameters = { username: event.request.userAttributes.email };

	// Add the secret login code to the private challenge parameters
	// so it can be verified by the "Verify Auth Challenge Response" 
	event.response.privateChallengeParameters = { password };

	// Add the secret login code to the session so it is available
	// in a next invocation of the "Create Auth Challenge" trigger
	event.response.challengeMetadata = `PASSWORD-${password}`;

	return event;
}