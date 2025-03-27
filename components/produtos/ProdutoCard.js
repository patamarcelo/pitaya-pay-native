import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
import * as Haptics from 'expo-haptics';
import { Colors } from '../../constants/styles';
import { Image } from 'expo-image';
import { useState } from 'react';


const defaultImage = require("../../assets/no-image.png");
const ProdutoCard = ({ item, setSelectProdsList, selectProdsList }) => {

    const [error, setError] = useState(false);

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
        setSelectProdsList((prevList) => {
            const exists = prevList.find((p) => p.pk === product.pk);

            if (exists) {
                // Remove the product if it exists
                return prevList.filter((p) => p.pk !== product.pk);
            } else {
                // Add the product if it doesn't exist
                return [...prevList, product];
            }
        });
    }

    const blurhash =
    'LID9#O9F00~qM{M{oft700-;_39F'
//   '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';


    return (
        <Pressable
            style={({ pressed }) => [
                styles.mainContainer,
                pressed && styles.pressed,
                { backgroundColor: selectProdsList?.some((p) => p.pk === item.pk) ? 'rgba(153,204,153,1)' : 'white' },
                { border: selectProdsList?.some((p) => p.pk === item.pk) ? 'green' : 'white' },
                { borderWidth: selectProdsList?.some((p) => p.pk === item.pk) ? 1 : 0 },
            ]}
            onPress={() => handlePress(item)}
        >
            {/* Left: Product Image */}
            <Image
                source={{
                    uri: error ? defaultImage : item?.imageUrl, // If error, set to empty string, fallback to default image
                    cache: 'force-cache'  // Apply cache here
                }}
                contentFit="cover"
                placeholder={{ blurhash }}
                transition={250}
                style={styles.image}
                onError={() => setError(true)}  // Set error flag on image load failure
            />
            {/* <Image 
                source={item?.imageUrl ? { uri: item?.imageUrl } : require('../../assets/no-image.png')}  
                style={styles.image} 
            /> */}

            {/* Right: Product Info */}
            <View style={styles.textContainer}>
                <Text style={styles.productId}>{item.product_id_produto}</Text>
                <Text style={[styles.model, { color: selectProdsList?.some((p) => p.pk === item.pk) ? 'white' : '#2A9D8F' }]}>
                    {item.content_type__model?.charAt(0).toUpperCase() + item?.content_type__model?.slice(1)} {item.product_tamanho ? " - " + item.product_tamanho : ''}
                </Text>
            </View>

            {/* Right: Price */}
            <Text style={[styles.price, { color: selectProdsList?.some((p) => p.pk === item.pk) ? 'white' : '#2A9D8F' },]}>R$ {formaCurrency(item.sell_price)}</Text>
        </Pressable>
    )
}

export default ProdutoCard

const styles = StyleSheet.create({
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