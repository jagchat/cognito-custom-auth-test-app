import * as bootstrap from 'bootstrap';
import $ from 'jquery';
import { Amplify, Auth } from 'aws-amplify'

Amplify.configure({
    Auth: {
        region: 'us-east-2',
        userPoolId: 'us-east-2_32QZBjg1x',
        userPoolWebClientId: '59oafp8kdjpi2nd28ephe18puv',
        authenticationFlowType: 'CUSTOM_AUTH'
    }
})

// async function signIn(email, password) {
//     return Auth.signIn({
//         username: email,
//     })
// }

export default () => {

    $('#LoginButton').on("click", async (event) => {
        event.preventDefault();
        $('#message').text("");
        try {
            var username = $('#inputUserName').val();
            var password = $('#inputPassword').val();
            //let user = await signIn(username, password);
            //console.log(user);
            //let user = await Auth.signIn(username, password);
            //Auth.configure({ storage: null });
            let user = await Auth.signIn(username)
                .then(u => {
                    console.log("after sign-in...before challenge..");
                    console.log(u);
                    if (u.challengeName === 'CUSTOM_CHALLENGE') {
                        console.log("responding to challenge..");
                        // to send the answer of the custom challenge
                        Auth.sendCustomChallengeAnswer(u, password)
                            .then(u2 => {
                                console.log("after responding to challenge...");
                                console.log(u2);
                                return u2;
                            })
                            .catch(err => {
                                console.log("ERROR with Challenge:");
                                console.log(err);
                            });
                    } else {
                        console.log("no challenge needed..");
                        return u;
                    }
                })
                .catch(err => {
                    console.log("ERROR with sign-in:..");
                    console.log(err);
                });

            let accessTokenMarkup = `<tr><td>Access Token</td><td>${user.signInUserSession.accessToken.jwtToken}</td></tr>`;
            let idTokenMarkup = `<tr><td>Id Token</td><td>${user.signInUserSession.idToken.jwtToken}</td></tr>`;
            let refreshTokenMarkup = `<tr><td>Refresh Token</td><td>${user.signInUserSession.refreshToken.token}</td></tr>`;
            $('#message').html(`<table class="table">${accessTokenMarkup + idTokenMarkup + refreshTokenMarkup}</table>`);
            console.log(user);
        } catch (e) {
            console.error('Login Error: ', e);
            $('#message').text("Could not login");
        }
    });

}