// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

// const CreateStore = () => {
//   const [store, setStore] = useState({
//     name: '',
//     description: '',
//     opening: '',
//     closing: '',
//     location: '',
//     category: '',
//     isOpen: false,
//     distance: '0',
//     storeContactNumber: '',
//   });

//   const handleInputChange = (name, value) => {
//     setStore({
//       ...store,
//       [name]: value,
//     });
//   };

//   const handleSubmit = () => {
//     console.log('Store details:', store);
//     // Perform form submission logic here
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Create Store</Text>
//       <Text style={styles.subtitle}>Set-up your store right now!</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Description"
//         value={store.description}
//         onChangeText={(value) => handleInputChange('description', value)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Store Name"
//         value={store.name}
//         onChangeText={(value) => handleInputChange('name', value)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Opening Hours (HH:MM)"
//         value={store.opening}
//         onChangeText={(value) => handleInputChange('opening', value)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Closing Hours (HH:MM)"
//         value={store.closing}
//         onChangeText={(value) => handleInputChange('closing', value)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Store Category"
//         value={store.category}
//         onChangeText={(value) => handleInputChange('category', value)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Store Address"
//         value={store.location}
//         onChangeText={(value) => handleInputChange('location', value)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Store Contact Number"
//         value={store.storeContactNumber}
//         onChangeText={(value) => handleInputChange('storeContactNumber', value)}
//       />
//       <TouchableOpacity style={styles.button} onPress={handleSubmit}>
//         <Text style={styles.buttonText}>Create Store</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#F5F5F5',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: '#2E8B57',
//   },
//   subtitle: {
//     fontSize: 16,
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   input: {
//     width: '100%',
//     height: 50,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     marginBottom: 15,
//     backgroundColor: '#fff',
//   },
//   button: {
//     backgroundColor: '#2E8B57',
//     borderRadius: 5,
//     paddingVertical: 15,
//     paddingHorizontal: 30,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default CreateStore;
