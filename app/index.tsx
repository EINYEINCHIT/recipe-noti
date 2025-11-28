import { Redirect } from "expo-router";
import messaging from '@react-native-firebase/messaging';
import React, { use, useEffect } from 'react';

const Index = () => {
  return <Redirect href="/auth/Login" />;
};

export default Index;