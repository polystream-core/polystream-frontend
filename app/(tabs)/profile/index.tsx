import {Clipboard, Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors} from "@/src/constants/Colors";
import {fonts} from "@/src/constants/Fonts";
import {useUserInfo} from '@/src/hooks/useUserInfo';
import {images} from "@/src/constants/Images";
import React, {useState, useEffect, useRef} from 'react';
import Pill from '@/src/components/Pill';
import { usePrivy } from '@privy-io/expo';

export default function Tab() {
  const {name, username, email, embeddedWalletAddress} = useUserInfo();
  const { logout } = usePrivy();
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [logoutExpanded, setLogoutExpanded] = useState(false);
  const logoutTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    Clipboard.setString(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const truncateWalletAddress = (address: string) => {
    return `${address.substring(0, 12)}...${address.substring(address.length - 4)}`;
  };

  const handleLogoutPress = () => {
    if (logoutExpanded) {
      // Second press - perform logout
      logout();
      setLogoutExpanded(false);
      if (logoutTimeoutRef.current) {
        clearTimeout(logoutTimeoutRef.current);
        logoutTimeoutRef.current = null;
      }
    } else {
      // First press - expand the button
      setLogoutExpanded(true);

      // Set timeout to collapse after 4 seconds
      logoutTimeoutRef.current = setTimeout(() => {
        setLogoutExpanded(false);
      }, 4000);
    }
  };

  // Clear timeout on component unmount
  useEffect(() => {
    return () => {
      if (logoutTimeoutRef.current) {
        clearTimeout(logoutTimeoutRef.current);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.pageTitle}>Profile</Text>
          <Pressable
            style={[
              styles.headerLogoutButton,
              logoutExpanded ? styles.headerLogoutButtonExpanded : styles.headerLogoutButtonCollapsed
            ]}
            onPress={handleLogoutPress}
          >
            <Image
              source={images.log_out}
              style={styles.headerLogoutIcon}
              resizeMode="contain"
            />
            {logoutExpanded && (
              <Text style={styles.headerLogoutText}>Logout</Text>
            )}
          </Pressable>
        </View>

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{name?.charAt(0) || 'U'}</Text>
          </View>
          <View style={styles.userInfoContainer}>
            <Text style={styles.nameText}>{name}</Text>
            <Text style={styles.usernameText}>@{username}</Text>
            <View style={styles.pillWrapper}>
              <Pill status='active' showIcon={true}/>
            </View>
          </View>
        </View>

        {/* User Details Cards */}
        <View style={styles.cardContainer}>
          <Text style={styles.sectionTitle}>Account Details</Text>

          {/* Wallet Address */}
          <View style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <Image source={images.guarded} style={styles.detailIcon} resizeMode="contain"/>
              <Text style={styles.detailLabelText}>Wallet Address</Text>
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailValueText}>{truncateWalletAddress(embeddedWalletAddress)}</Text>
              <TouchableOpacity
                onPress={() => copyToClipboard(embeddedWalletAddress, 'wallet')}
                style={styles.copyIconContainer}
              >
                {copiedText === 'wallet' ? (
                  <Text style={styles.copiedText}>Copied!</Text>
                ) : (
                  <Image source={images.copy} style={styles.copyIcon} resizeMode="contain"/>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Email */}
          <View style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <Image source={images.details} style={styles.detailIcon} resizeMode="contain"/>
              <Text style={styles.detailLabelText}>Email</Text>
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailValueText}>{email}</Text>
              <TouchableOpacity
                onPress={() => copyToClipboard(email, 'email')}
                style={styles.copyIconContainer}
              >
                {copiedText === 'email' ? (
                  <Text style={styles.copiedText}>Copied!</Text>
                ) : (
                  <Image source={images.copy} style={styles.copyIcon} resizeMode="contain"/>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Bottom logout button removed since we now have the dynamic one in the header */}
      </ScrollView>
      <View style={styles.decorativeElement}>
        <Image
          source={images.polystream_logo_trans}
          style={styles.backgroundLogo}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.beige.color03
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    zIndex: 1
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 24,
  },
  pageTitle: {
    fontFamily: fonts.primary.bold,
    fontSize: 28,
    color: colors.black.primary,
  },
  headerLogoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.red.color03,
    borderWidth: 1,
    borderColor: colors.red.color01,
    overflow: 'hidden',
  },
  headerLogoutButtonCollapsed: {
    borderRadius: 24,
    padding: 12,
    width: 48,
    height: 48,
    justifyContent: 'center',
  },
  headerLogoutButtonExpanded: {
    height: 48,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  headerLogoutIcon: {
    width: 22,
    height: 22,
    tintColor: colors.red.primary,
  },
  headerLogoutText: {
    fontFamily: fonts.secondary.medium,
    fontSize: 14,
    color: colors.red.primary,
    padding: 4
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.beige.color01,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: colors.cyan.color01,
  },
  avatarText: {
    fontFamily: fonts.primary.bold,
    fontSize: 32,
    color: colors.black.primary,
  },
  userInfoContainer: {
    flex: 1,
  },
  nameText: {
    fontFamily: fonts.primary.semibold,
    fontSize: 24,
    color: colors.black.primary,
    marginBottom: 4,
  },
  usernameText: {
    fontFamily: fonts.secondary.regular,
    fontSize: 16,
    color: colors.black.color02,
    marginBottom: 8,
  },
  pillWrapper: {
    alignSelf: 'flex-start',
  },
  cardContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: fonts.primary.semibold,
    fontSize: 20,
    color: colors.black.primary,
    marginBottom: 16,
  },
  detailCard: {
    backgroundColor: colors.grey.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.black.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    tintColor: colors.black.color02,
  },
  detailLabelText: {
    fontFamily: fonts.primary.medium,
    fontSize: 16,
    color: colors.black.color02,
  },
  detailContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 34
  },
  detailValueText: {
    fontFamily: fonts.code.regular,
    fontSize: 16,
    color: colors.black.primary,
    flex: 1,
  },
  copyIconContainer: {
    padding: 8,
  },
  copyIcon: {
    width: 20,
    height: 20,
    tintColor: colors.beige.color01,
  },
  copiedText: {
    fontFamily: fonts.code.light,
    fontSize: 14,
    color: colors.red.color01,
  },
  decorativeElement: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.2,
    zIndex: 0,
    pointerEvents: 'none'
  },
  backgroundLogo: {
    position: "absolute",
    width: 200,
    height: 200,
    opacity: 0.4,
  }
});