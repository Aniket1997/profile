import React, { useState, useReducer, useEffect } from 'react';
import InputField from './InputField';
import { db, storage } from '../../firebaseConfig';
import { updateDoc, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form, Button, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const formReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        [action.field]: action.value,
      };
    default:
      return state;
  }
};

const AuthForm = ({ onSubmit, buttonText, fieldConfigs }) => {
  const initialFormData = fieldConfigs.reduce((acc, config) => {
    acc[config.name] = config.type === 'number' ? 0 : '';
    return acc;
  }, {});

  const [formData, dispatch] = useReducer(formReducer, initialFormData);
  const [uploadedPicture, setUploadedPicture] = useState(null);
  const [formIsValid, setFormIsValid] = useState(false);

  useEffect(() => {
    const isFormValid = fieldConfigs.every(
      (config) =>
        formData[config.name].trim() !== '' || config.type === 'number'
    );

    setFormIsValid(isFormValid);
  }, [formData, fieldConfigs]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    dispatch({
      type: 'UPDATE_FIELD',
      field: name,
      value: value,
    });
  };

  const handlePictureUpload = (event) => {
    const selectedFile = event.target.files[0];
    setUploadedPicture(selectedFile);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const authUser = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      toast.success(`User successfully signed up: ${authUser.user.email}`);
      console.log('User ID:', authUser.user.uid);

      const userDocRef = doc(db, 'users', authUser.user.uid);

      await setDoc(userDocRef, {
        ...formData,
        userId: authUser.user.uid,
      });

      if (uploadedPicture) {
        const storageRef = ref(storage, `pictures/${authUser.user.uid}`);
        await uploadBytes(storageRef, uploadedPicture);

        const downloadURL = await getDownloadURL(storageRef);
        await updateDoc(userDocRef, { picture: downloadURL });
        console.log('Picture uploaded successfully');
      }

      console.log('User data stored in Firestore.');
      onSubmit();
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email already exists. Please sign in instead.');
      } else {
        console.error('Error signing up or storing data:', error.message);
      }
    }
  };

  const inputFields = fieldConfigs.map((config) => (
    <InputField
      key={config.name}
      label={config.label}
      name={config.name}
      type={config.type}
      value={formData[config.name]}
      onChange={handleInputChange}
    />
  ));

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <div className="auth-box">
        <ToastContainer />
        <Form onSubmit={handleSubmit}>
          {inputFields}
          <Form.Group controlId="picture">
            <Form.Label>Upload Picture:</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handlePictureUpload}
            />
            {uploadedPicture && (
              <p>Uploaded Picture: {uploadedPicture.name}</p>
            )}
            <Button type="submit" disabled={!formIsValid}>
              {buttonText}
            </Button>
          </Form.Group>
        </Form>
        <p>
          Already have an account?{' '}
          <Button variant="link">
            Sign In
          </Button>
        </p>
      </div>
    </Container>
  );
};

export default AuthForm;
