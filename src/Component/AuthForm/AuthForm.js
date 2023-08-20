import React, { useState, useReducer, useEffect } from 'react';
import InputField from './InputField';
import { db, storage } from '../../firebaseConfig';
import { updateDoc, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      // Create user in Firebase Authentication
      const authUser = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      toast.success(`User successfully signed up:', ${authUser.user.email}`);
      console.log('User ID:', authUser.user.uid);

      const userDocRef = doc(db, 'users', authUser.user.uid);

      // Store additional user data in Firestore
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
      onSubmit(); // Notify parent component of form submission if needed
    } catch (error) {
      console.error('Error signing up or storing data:', error.message);
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
    <>
    <ToastContainer/>
    <form onSubmit={handleSubmit}>
      {inputFields}
      <div>
        <label htmlFor="picture">Upload Picture:</label>
        <input
          type="file"
          id="picture"
          accept="image/*"
          onChange={handlePictureUpload}
        />
      </div>
      {uploadedPicture && <p>Uploaded Picture: {uploadedPicture.name}</p>}
      <button type="submit" disabled={!formIsValid}>
        {buttonText}
      </button>
    </form>
    </>
  );
};

export default AuthForm;
