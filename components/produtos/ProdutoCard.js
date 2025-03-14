import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
import * as Haptics from 'expo-haptics';
import { Colors } from '../../constants/styles';
import { Image } from 'expo-image';


const ProdutoCard = ({ item,  setSelectProdsList, selectProdsList }) => {
    const formaCurrency = (number) => {
        return number.toLocaleString(
            "pt-br",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })
    }

    const handlePress = (product) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
        console.log('dataHerePress: ', product)
        setSelectProdsList((prevList) => {
            const exists = prevList.find((p) => p.product_id_produto === product.product_id_produto);
    
            if (exists) {
                // Remove the product if it exists
                return prevList.filter((p) => p.product_id_produto !== product.product_id_produto);
            } else {
                // Add the product if it doesn't exist
                return [...prevList, product];
            }
        });
    }
    return (
        <Pressable
            style={({ pressed }) => [
                styles.mainContainer,
                pressed && styles.pressed,
                { backgroundColor: selectProdsList?.some((p) => p.product_id_produto === item.product_id_produto) ? 'rgba(153,204,153,1)' : 'white' }, 
                { border: selectProdsList?.some((p) => p.product_id_produto === item.product_id_produto) ? 'green' : 'white' }, 
                { borderWidth: selectProdsList?.some((p) => p.product_id_produto === item.product_id_produto) ? 1 : 0 }, 
            ]}
            onPress={() => handlePress(item)}
        >
            {/* Left: Product Image */}
            <Image 
                source={item?.imageUrl ? { uri: item?.imageUrl } : require('../../assets/no-image.png')}  
                style={styles.image} 
            />

            {/* Right: Product Info */}
            <View style={styles.textContainer}>
                <Text style={styles.productId}>{item.product_id_produto}</Text>
                <Text style={[styles.model,{ color: selectProdsList?.some((p) => p.product_id_produto === item.product_id_produto) ? 'white' : '#2A9D8F'  }]}>
                {item.content_type__model?.charAt(0).toUpperCase() + item?.content_type__model?.slice(1)}
                    </Text>
            </View>

            {/* Right: Price */}
            <Text style={[styles.price,{ color: selectProdsList?.some((p) => p.product_id_produto === item.product_id_produto) ? 'white' : '#2A9D8F'  }, ]}>R$ {formaCurrency(item.sell_price)}</Text>
        </Pressable>
    )
}

export default ProdutoCard

const styles = StyleSheet.create({
    // mainContainer:{
    //     backgroundColor: Colors.secondary[100],
    //     borderRadius: 6,
    //     // width: '100%',
    //     marginHorizontal: 10,


    // },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2A9D8F',
        textAlign: 'right',
        minWidth: 80, // Ensures consistent alignment
    },
    textContainer: {
        flex: 1, // Take remaining space
        justifyContent: 'center',
    },
    mainContainer: {
        flexDirection: 'row',  // Align image & text horizontally
        alignItems: 'center',  // Center vertically
        backgroundColor: '#fff',
        padding: 12,
        marginVertical: 6,
        borderRadius: 10,
        elevation: 3, // Shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOpacity: 0.1,
        shadowRadius: 5,
        marginHorizontal: 10,
    },
    pressed: {
        opacity: 0.7, // Pressed effect
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 12,
    },
    textContainer: {
        flex: 1, // Take remaining space
    },
    productId: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    model: {
        fontSize: 14,
        color: '#666',
        marginVertical: 4,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2A9D8F',
    },
})