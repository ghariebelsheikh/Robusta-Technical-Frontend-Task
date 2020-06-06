const getElementById = (id) => {
	return document.getElementById(id);
}

const loginForm = getElementById('login-form');
const loginEmail = getElementById('login-email');
const loginPassword = getElementById('login-password');


const registerForm = getElementById('register-form');
const registerFullName = getElementById('register-fullname');
const registerEmail = getElementById('register-email');
const registerUserName = getElementById('register-username');
const registerPassword = getElementById('register-password');



registerForm.addEventListener('submit', (e) => {
	e.preventDefault();

	const data = getSignUpData();
	const errors = checkSignUpValidationErrors(data);
	updateSignUpUI(errors);
	const isValid = Object.keys(errors).length === 0;
	if (isValid) {
		sendData(data, 'auth/register');
	}
})

loginForm.addEventListener('submit', (e) => {
	e.preventDefault();

	const data = getSignInData();
	const errors = checkSignInValidationErrors(data);
	updateSignInUI(errors);
	const isValid = Object.keys(errors).length === 0;
	if (isValid) {
		sendData(data, 'auth/login');
	}

})

const getSignUpData = () => {
	const name = registerFullName.value.trim();
	const email = registerEmail.value.trim();
	const username = registerUserName.value.trim();
	const password = registerPassword.value.trim();
	return {
		name,
		email,
		username,
		password
	}
}

const getSignInData = () => {
	const email = loginEmail.value.trim();
	const password = loginPassword.value.trim();
	return {
		email,
		password
	}
}



const checkSignInValidationErrors = ({ email, password }) => {
	const errors = {}

	if (email === '') {
		errors.email = 'Email cannot be empty';
	}

	if (password === '') {
		errors.password = 'Password cannot be blank';
	}

	return errors;
}

const checkSignUpValidationErrors = ({ name, email, username, password }) => {
	const errors = {}

	if (name === '') {
		errors.name = 'Fullname cannot be empty'
	}

	if (email === '') {
		errors.email = 'Email cannot be empty';

	} else if (!isEmail(email)) {
		errors.email = 'Not a valid email';

	}

	if (username === '') {
		errors.username = 'Username cannot be empty';
	}

	if (password === '') {
		errors.password = 'Password cannot be blank';

	} else if (password.length < 5) {
		errors.password = 'Password must be at least 5 characters';
	}

	return errors;

}

const updateSignUpUI = (errors) => {
	const fields = {
		name: registerFullName,
		email: registerEmail,
		username: registerUserName,
		password: registerPassword
	};

	for (const [fieldName, domElement] of Object.entries(fields)) {
		if (fieldName in errors) {
			const message = errors[fieldName];
			setErrorFor(domElement, message);
		} else {
			setSuccessFor(domElement);
		}
	}
}

const updateSignInUI = (errors) => {
	const fields = {
		email: loginEmail,
		password: loginPassword
	};

	for (const [fieldName, domElement] of Object.entries(fields)) {
		if (fieldName in errors) {
			const message = errors[fieldName];
			setErrorFor(domElement, message);
		} else {
			setSuccessFor(domElement);
		}
	}
}


const setErrorFor = (input, message) => {
	const formControl = input.parentElement;
	const small = formControl.querySelector('small');
	formControl.className = 'form-control error';
	small.innerText = message;
}

const setSuccessFor = (input) => {
	const formControl = input.parentElement;
	formControl.className = 'form-control success';
}

const isEmail = (email) => {
	const regexForEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	return regexForEmail.test(email);
}


// USING XMLHTTPREQUEST TO SUBMIT FORM DATA
// ----------------------------------------

const sendHttpRequest = (method, url, data) => {
	const promise = new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open(method, url);

		xhr.responseType = 'json';

		if (data) {
			xhr.setRequestHeader('Content-Type', 'application/json');
		}

		xhr.onload = () => {
			if (xhr.status >= 400) {
				reject(xhr.response);
			} else {
				resolve(xhr.response);
			}
		};

		xhr.onerror = () => {
			reject('Something went wrong!');
		};

		xhr.send(JSON.stringify(data));
	});
	return promise;
};


const sendData = async (data, url) => {
	try {
		const responseData = await sendHttpRequest('POST', `https://private-b2e6827-robustatask.apiary-mock.com/${url}`, data);
		console.log(responseData)

	} catch (err) {
		console.log(err)
	}
};




// HANDLE TABS TO CHANGE BETWEEN TWO FORMS SIGN UP/IN
// --------------------------------------------------

window.addEventListener('hashchange', () => {
	if (location.hash.slice(1) == "register") {
		document.querySelector('.card').classList.add('extend');
		document.querySelector('#login').classList.remove('selected');
		document.querySelector('#register').classList.add('selected');
	} else {
		document.querySelector('.card').classList.remove('extend');
		document.querySelector('#login').classList.add('selected');
		document.querySelector('#register').classList.remove('selected');
	}
})

window.dispatchEvent(new Event('hashchange'));
