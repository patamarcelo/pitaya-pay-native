import { View, Text, StyleSheet} from 'react-native'
import { useLayoutEffect } from 'react';
import { Colors } from '../../constants/styles';
import IconButton from '../ui/IconButton';
import LinkForm from './LinkForm';

import { useState } from 'react';



const LinkPage = ({navigation}) => {

	const [valuesFormObj, setvaluesFormObj] = useState("");

    const handleBack = () => {
		navigation.goBack();
	};
    
    useLayoutEffect(() => {
		navigation.setOptions({
			title: "Link para Pagamento",
			headerShadowVisible: false,
			headerTintColor: "whitesmoke",
			headerShown: true,
			contentStyle: { backgroundColor: Colors.primary500 },
			headerLeft: ({ tintColor }) => (
				<IconButton
					icon="arrow-back"
					color={tintColor}
					size={24}
					onPress={handleBack}
				/>
			)
		});
	}, []);

	

    return (  
        <View style={styles.mainContainer}>
			<View style={styles.formView}>
            	<LinkForm setvaluesFormObj={setvaluesFormObj}/>
			</View>

        </View>
    );
}
 

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
	formView:{
		flex: 1,
		width: '100%',
		alignItems: 'center',
		gap: 10
	},
	btnStyle: {
		width: '90%',
		marginBottom: 100
	}
})

export default LinkPage;