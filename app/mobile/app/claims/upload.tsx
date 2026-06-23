import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useAuth } from '../../context/AuthContext';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../../constants/theme';

export default function UploadDocumentsScreen() {
  const { uploadClaimDocuments } = useAuth();
  const { id } = useLocalSearchParams();
  const [files, setFiles] = useState<Array<{ uri: string; name: string }>>([]);
  const [isUploading, setIsUploading] = useState(false);

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result.assets && result.assets.length > 0) {
        const pickedFile = result.assets[0];
        setFiles((prev) => [...prev, { uri: pickedFile.uri, name: pickedFile.name }]);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to select document. Please try again.');
    }
  };

  const removeFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleUpload = async () => {
    if (!files.length) {
      Alert.alert('No Documents', 'Please select at least one document to upload.');
      return;
    }
    setIsUploading(true);
    try {
      // Simulate network uploading latency
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await uploadClaimDocuments(id as string, files);
      Alert.alert('Success', 'Supporting documents successfully uploaded to your claim.');
      router.replace(`/claims/${id}`);
    } catch (e) {
      Alert.alert('Upload Failed', 'Failed to upload documents. Please check your internet connection and try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload Documents</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.instructionTitle}>Upload Claim Documents</Text>
        <Text style={styles.instructionSub}>
          Attach medical prescriptions, diagnostic test reports, hospital discharge summary, and pharmacy bills.
        </Text>

        {/* Dashed Dropzone Box */}
        <TouchableOpacity style={styles.dropzone} activeOpacity={0.8} onPress={pickFile}>
          <Ionicons name="cloud-upload-outline" size={48} color={colors.primary} />
          <Text style={styles.dropzoneTitle}>Select Medical File / Document</Text>
          <Text style={styles.dropzoneSub}>Supports PDF, JPEG, PNG format</Text>
        </TouchableOpacity>

        {/* Selected Files List */}
        <View style={{ flex: 1, marginTop: spacing.md }}>
          <Text style={styles.listLabel}>Selected Documents ({files.length})</Text>
          <FlatList
            data={files}
            keyExtractor={(item, idx) => idx.toString()}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item, index }) => (
              <View style={styles.fileCard}>
                <Ionicons name="document-text" size={24} color={colors.primary} style={{ marginRight: spacing.sm }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.fileName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.fileSize}>Ready to upload</Text>
                </View>
                <TouchableOpacity style={styles.removeBtn} onPress={() => removeFile(index)}>
                  <Ionicons name="trash-outline" size={18} color={colors.danger} />
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No documents selected. Tap above to pick files.</Text>
              </View>
            }
          />
        </View>

        {/* Bottom Upload Action */}
        <TouchableOpacity
          style={[styles.uploadBtn, isUploading && { opacity: 0.8 }]}
          onPress={handleUpload}
          disabled={isUploading}
        >
          {isUploading ? (
            <ActivityIndicator color={colors.white} size="small" />
          ) : (
            <>
              <Ionicons name="cloud-upload" size={20} color="#fff" />
              <Text style={styles.uploadBtnText}>Submit Documents</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  instructionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.xs,
    marginBottom: 4,
  },
  instructionSub: {
    fontSize: 14,
    color: colors.subtext,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  dropzone: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryLight,
    paddingVertical: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  dropzoneTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primaryDark,
    marginTop: spacing.md,
    marginBottom: 2,
  },
  dropzoneSub: {
    fontSize: 12,
    color: colors.subtext,
  },
  listLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  listContainer: {
    gap: spacing.sm,
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...shadows.sm,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  fileSize: {
    fontSize: 11,
    color: colors.subtext,
    marginTop: 2,
  },
  removeBtn: {
    padding: 6,
  },
  emptyContainer: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.subtext,
    textAlign: 'center',
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    height: 50,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
    marginTop: spacing.md,
    ...shadows.md,
  },
  uploadBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
