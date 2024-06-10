import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
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
        const activeStoreId = userQuerySnapshot.docs[0].data().storeId;

        console.log(activeStoreId);

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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Reviews for this Shop</Text>
      {reviews.length > 0 ? (
        <View>
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
          {reviews.map((review) => (
            <View key={review.id} style={styles.card}>
              <Text style={styles.ratingText}>Rating:</Text>
              <View style={styles.starsContainer}>
              {Array.from({ length: Math.floor(review.rating) }).map((_, index) => (
                <Ionicons key={index} name="star" size={20} color="#FFD700" />
              ))}
              {Array.from({ length: Math.max(5 - Math.ceil(review.rating), 0) }).map((_, index) => (
                <Ionicons key={index} name="star-outline" size={20} color="#FFD700" />
              ))}
              </View>
              <Text style={styles.commentText}>Comment: {review.comment}</Text>
              <Text style={styles.userText}>By: {review.userName}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.noReviewsText}>No reviews found for this shop.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  averageRatingText: {
    fontSize: 18,
    marginRight: 10,
  },
  averageRatingNumber: {
    fontSize: 18,
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  card: {
    marginBottom: 20,
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