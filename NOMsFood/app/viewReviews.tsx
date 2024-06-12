import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { getAuth } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';

interface Review {
  id: string;
  rating: number;
  comment: string;
  userName: string;
}

const viewReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [storeName, setStoreName] = useState<string>('');

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    calculateAverageRating();
  }, [reviews]);

  const fetchReviews = async () => {
    try {
      const auth = getAuth();
      const activeUser = auth.currentUser;
      if (activeUser) {
        const userQuerySnapshot = await getDocs(
          query(collection(db, 'Users'), where('userId', '==', activeUser.uid))
        );
        const userData = userQuerySnapshot.docs[0].data();
        const activeStoreId = userData.storeId;

        setStoreName(userData.storeName); // Assuming storeName is stored in userData

        const reviewsRef = collection(db, 'Review');
        const q = query(reviewsRef, where('storeId', '==', activeStoreId));
        const querySnapshot = await getDocs(q);

        const reviewsData: Review[] = [];
        querySnapshot.forEach((doc) => {
          reviewsData.push({ id: doc.id, ...doc.data() } as Review);
        });

        setReviews(reviewsData);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) {
      setAverageRating(0);
      return;
    }

    const totalRating = reviews.reduce((accumulator, review) => accumulator + review.rating, 0);
    const avgRating = totalRating / reviews.length;
    setAverageRating(avgRating);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Reviews for this Shop</Text>
          
          <View style={styles.ratingContainer}>
            <Text style={styles.averageRatingText}>Average Rating:</Text>
            {Array.from({ length: Math.floor(averageRating) }).map((_, index) => (
              <Ionicons key={index} name="star" size={20} color="#FFD700" />
            ))}
            {averageRating % 1 !== 0 && <Ionicons name="star-half" size={20} color="#FFD700" />}
            {Array.from({ length: Math.floor(5 - averageRating) }).map((_, index) => (
              <Ionicons key={index} name="star-outline" size={20} color="#FFD700" />
            ))}
            <Text style={styles.averageRatingNumber}>({averageRating.toFixed(1)} / 5)</Text>
          </View>
          <Text style={styles.subtitle}>Number of Ratings: {reviews.length}</Text>
        </View>
        {reviews.length > 0 ? (
          <View>
            {reviews.map((review) => (
              <View key={review.id} style={styles.card}>
                <Text style={styles.ratingText}>{review.userName}</Text>
                <View style={styles.starsContainer}>
                  {Array.from({ length: Math.floor(review.rating) }).map((_, index) => (
                    <Ionicons key={index} name="star" size={20} color="#FFD700" />
                  ))}
                  {Array.from({ length: Math.max(5 - Math.ceil(review.rating), 0) }).map((_, index) => (
                    <Ionicons key={index} name="star-outline" size={20} color="#FFD700" />
                  ))}
                </View>
                <Text style={styles.commentText}>{review.comment}</Text>
               
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noReviewsText}>No reviews found for this shop.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#29542b',
  },
  container: {
    flexGrow: 1,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  headerContainer: {
    backgroundColor: '#29542b',
    paddingTop: 40, // Reduced padding to shift up
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  storeName: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  averageRatingText: {
    fontSize: 18,
    color: '#fff',
    marginRight: 10,
  },
  averageRatingNumber: {
    fontSize: 18,
    color: '#fff',
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  card: {
    marginBottom: 20,
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  commentText: {
    fontSize: 16,
    marginTop: 10,
  },
  userText: {
    fontSize: 14,
    marginTop: 5,
    color: '#555',
  },
  noReviewsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default viewReviews;
