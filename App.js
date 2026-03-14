import React, { createContext, useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const AppContext = createContext();

const PRODUCTS = [
  { id: '1', name: 'Laptop', price: 999 },
  { id: '2', name: 'Smartphone', price: 499 },
  { id: '3', name: 'Headphones', price: 199 },
  { id: '4', name: 'Smartwatch', price: 299 },
];

function ProductsScreen() {
  const { cart, setCart, wishlist, setWishlist } = useContext(AppContext);

  const addToCart = (product) => setCart([...cart, product]);
  const addToWishlist = (product) => setWishlist([...wishlist, product]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>${item.price}</Text>
      <View style={styles.actions}>
        <View style={{ flex: 1, marginRight: 5 }}>
          <Button title="Add to Cart" onPress={() => addToCart(item)} />
        </View>
        <View style={{ flex: 1, marginLeft: 5 }}>
          <Button title="Wishlist" color="purple" onPress={() => addToWishlist(item)} />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList data={PRODUCTS} renderItem={renderItem} keyExtractor={item => item.id} />
    </View>
  );
}

function CartScreen() {
  const { cart, setCart } = useContext(AppContext);

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  return (
    <View style={styles.container}>
      {cart.length === 0 ? <Text style={styles.emptyText}>Cart is empty</Text> : (
        <FlatList 
          data={cart} 
          keyExtractor={(item, index) => item.id + index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              <Text style={styles.productName}>{item.name} - ${item.price}</Text>
              <View style={{ marginTop: 10 }}>
                <Button title="Remove" color="red" onPress={() => removeFromCart(index)} />
              </View>
            </View>
          )} 
        />
      )}
    </View>
  );
}

function WishlistScreen() {
  const { wishlist, setWishlist, cart, setCart } = useContext(AppContext);

  const removeFromWishlist = (index) => {
    const newList = [...wishlist];
    newList.splice(index, 1);
    setWishlist(newList);
  };

  const moveToCart = (item, index) => {
    setCart([...cart, item]);
    removeFromWishlist(index);
  };

  return (
    <View style={styles.container}>
      {wishlist.length === 0 ? <Text style={styles.emptyText}>Wishlist is empty</Text> : (
        <FlatList 
          data={wishlist} 
          keyExtractor={(item, index) => item.id + index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              <Text style={styles.productName}>{item.name} - ${item.price}</Text>
              <View style={styles.actions}>
                <View style={{ flex: 1, marginRight: 5 }}>
                  <Button title="Move to Cart" onPress={() => moveToCart(item, index)} />
                </View>
                <View style={{ flex: 1, marginLeft: 5 }}>
                  <Button title="Remove" color="red" onPress={() => removeFromWishlist(index)} />
                </View>
              </View>
            </View>
          )} 
        />
      )}
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={styles.centerContainer}>
      <View style={styles.profileAvatar}>
        <Text style={styles.avatarText}>JS</Text>
      </View>
      <Text style={styles.profileName}>John Smith</Text>
      <Text style={styles.profileEmail}>john.smith@example.com</Text>
      <View style={{ marginTop: 30, width: 200 }}>
        <Button title="Edit Profile" onPress={() => {}} />
      </View>
      <View style={{ marginTop: 10, width: 200 }}>
        <Button title="Logout" color="red" onPress={() => {}} />
      </View>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  return (
    <AppContext.Provider value={{ cart, setCart, wishlist, setWishlist }}>
      <NavigationContainer>
        <Tab.Navigator screenOptions={{ tabBarLabelPosition: 'below-icon' }}>
          <Tab.Screen name="Products" component={ProductsScreen} />
          <Tab.Screen name="Cart" component={CartScreen} options={{ tabBarBadge: cart.length > 0 ? cart.length : null }} />
          <Tab.Screen name="Wishlist" component={WishlistScreen} options={{ tabBarBadge: wishlist.length > 0 ? wishlist.length : null }} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  card: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee'
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#999'
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarText: {
    fontSize: 40,
    color: '#666',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  }
});
