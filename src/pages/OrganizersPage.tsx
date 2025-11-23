import { useState, useEffect } from "react";
import { Card, message, Typography, Spin, Form } from "antd";
import { useTranslation } from "react-i18next";
import { mockOrganizers } from "../data/mockOrganizers";
import {
  OrganizerCard,
  StatisticsCards,
  SearchAndFilter,
  OrganizersHeader,
  AddOrganizerModal,
  EditOrganizerModal,
  OrganizerDetailsModal,
  DeleteConfirmModal,
  NationalityModal,
  GenderModal,
  STORAGE_KEY,
  saveToLocalStorage,
  loadFromLocalStorage,
} from "../components/Organizers Component";
import type { Organizer } from "../components/Organizers Component";

const { Text } = Typography;

const OrganizersPage = () => {
  const { t } = useTranslation("organizers");
  const { t: tCommon } = useTranslation("common");
  const [form] = Form.useForm();
  
  // Translate nationality function
  const translateNationality = (nationality: string): string => {
    if (!nationality) return nationality;
    try {
      // Map country names to translation keys
      const nationalityMap: { [key: string]: string } = {
        "Saudi Arabia": "saudi",
        "Egypt": "egyptian",
        "Pakistan": "pakistani",
        "India": "indian",
        "Bangladesh": "bangladeshi",
        "Turkey": "turkish",
        "Indonesia": "indonesian",
        "Malaysia": "malaysian",
        "Nigeria": "nigerian",
        "Sudan": "sudanese",
        "Yemen": "yemeni",
        "Morocco": "moroccan",
        "Algeria": "algerian",
        "Tunisia": "tunisian",
        "Jordan": "jordanian",
        "Lebanon": "lebanese",
        "Syria": "syrian",
        "Iraq": "iraqi",
        "Afghanistan": "afghan",
        "Somalia": "somali",
        "Ethiopia": "ethiopian",
      };
      
      const translationKey = nationalityMap[nationality] || nationality.toLowerCase().replace(/\s+/g, "");
      const fullKey = `nationalities.${translationKey}`;
      
      // Try common namespace (where nationalities are stored)
      const translated = tCommon(fullKey, { defaultValue: nationality });
      // If translation exists and is different from the key, return it
      if (translated && translated !== fullKey && translated !== nationality) {
        return translated;
      }
    } catch (error) {
      console.warn("Translation error for nationality:", nationality, error);
    }
    // Otherwise return the original nationality
    return nationality;
  };

  // Translate gender function
  const translateGender = (gender: string): string => {
    if (!gender) return gender;
    if (gender === "Male") return t("male");
    if (gender === "Female") return t("female");
    return gender;
  };
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [nationalityModalVisible, setNationalityModalVisible] = useState(false);
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [selectedNationality, setSelectedNationality] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [selectedOrganizer, setSelectedOrganizer] = useState<Organizer | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [searchText, setSearchText] = useState<string>("");
  const [searchType, setSearchType] = useState<string>("all"); // "all", "organizerNationality", "hajjNationality", "organizerNumber", "licenseNumber"
  const [showSearchOptions, setShowSearchOptions] = useState(false);

  // Local storage helpers - using imported functions
  const saveToLocalStorageHelper = (data: Organizer[]) => saveToLocalStorage(data, STORAGE_KEY);
  const loadFromLocalStorageHelper = (): Organizer[] => loadFromLocalStorage(STORAGE_KEY);

  // Fetch organizers from localStorage or mock data
  const fetchOrganizers = async () => {
    setLoading(true);
    try {
      // Try localStorage first and merge with mock data
      const localData = loadFromLocalStorageHelper();
      const mockData = mockOrganizers as Organizer[];
      
      if (localData.length > 0) {
        // Merge localStorage data with mock data
        // Create a map to avoid duplicates based on organizerNumber
        const organizersMap = new Map<string, Organizer>();
        
        // First, add mock data
        mockData.forEach((org) => {
          organizersMap.set(org.organizerNumber, org);
        });
        
        // Then, add/override with localStorage data (localStorage has priority)
        localData.forEach((org) => {
          organizersMap.set(org.organizerNumber, org);
        });
        
        const mergedOrganizers = Array.from(organizersMap.values());
        console.log(`Loaded ${localData.length} organizers from local storage and merged with ${mockData.length} mock organizers. Total: ${mergedOrganizers.length}`);
        setOrganizers(mergedOrganizers);
        saveToLocalStorageHelper(mergedOrganizers);
        return;
      }

      // Use mock data as fallback and save to localStorage
      console.log("Using mock organizers data");
      const mockDataArray = mockData.map((org, index) => ({
        ...org,
        id: org.id || `mock_${index}_${Date.now()}`,
      }));
      setOrganizers(mockDataArray);
      saveToLocalStorageHelper(mockDataArray);
    } catch (error) {
      console.error("Error loading organizers:", error);
      // Final fallback to mock data
      const mockDataArray = (mockOrganizers as Organizer[]).map((org, index) => ({
        ...org,
        id: org.id || `mock_${index}_${Date.now()}`,
      }));
      setOrganizers(mockDataArray);
      saveToLocalStorageHelper(mockDataArray);
      message.warning("Using demo data. Please add organizers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizers();
  }, []);

  // Get unique nationalities
  const nationalities = Array.from(
    new Set(organizers.map((org) => org.nationality).filter(Boolean))
  );

  // Filter organizers based on search and nationality filter
  const filteredOrganizers = organizers.filter((org) => {
    let matchesSearch = true;
    
    if (searchText !== "") {
      const searchLower = searchText.toLowerCase();
      switch (searchType) {
        case "organizerNationality":
          matchesSearch = org.organizerNationality?.toLowerCase().includes(searchLower) || false;
          break;
        case "hajjNationality":
          matchesSearch = org.nationality?.toLowerCase().includes(searchLower) || false;
          break;
        case "organizerNumber":
          matchesSearch = org.organizerNumber?.toLowerCase().includes(searchLower) || false;
          break;
        case "licenseNumber":
          matchesSearch = org.licenseNumber?.toLowerCase().includes(searchLower) || false;
          break;
        default: // "all"
          matchesSearch = 
            org.company.toLowerCase().includes(searchLower) ||
            org.organizerNumber.toLowerCase().includes(searchLower) ||
            org.licenseNumber.toLowerCase().includes(searchLower) ||
            org.email.toLowerCase().includes(searchLower) ||
            org.organizerNationality?.toLowerCase().includes(searchLower) ||
            org.nationality?.toLowerCase().includes(searchLower);
          break;
      }
    }
    
    return matchesSearch;
  });

  // Calculate gender counts
  const maleCount = organizers.filter((org) => org.gender === "Male").length;
  const femaleCount = organizers.filter((org) => org.gender === "Female").length;

  // Calculate total hajj count for a specific nationality
  const getHajjCountByNationality = (nationality: string): number => {
    return organizers
      .filter((org) => org.nationality === nationality)
      .reduce((total, org) => total + (org.hajjCount || 0), 0);
  };

  // Handle nationality click (kept for future use)
  // const handleNationalityClick = (nationality: string) => {
  //   setSelectedNationality(nationality);
  //   setNationalityModalVisible(true);
  // };

  // Handle gender click
  const handleGenderClick = (gender: string) => {
    setSelectedGender(gender);
    setGenderModalVisible(true);
  };

  // Get organizers by gender
  const getOrganizersByGender = (gender: string): Organizer[] => {
    return organizers.filter((org) => org.gender === gender);
  };

  // Calculate total hajj count for a specific gender
  const getHajjCountByGender = (gender: string): number => {
    return organizers
      .filter((org) => org.gender === gender)
      .reduce((total, org) => total + (org.hajjCount || 0), 0);
  };

  // Handle image upload - convert to base64 for localStorage
  const handleImageUpload = async (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        console.error("Error reading image file");
        message.error("Failed to read image file");
        resolve(null);
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle form submission
  const handleSubmit = async (values: any) => {
    console.log("Form submitted with values:", values);
    
    setUploading(true);
    try {
      let imageURL = null;
      if (imageFile) {
        console.log("Processing image...");
        imageURL = await handleImageUpload(imageFile);
        if (!imageURL) {
          console.error("Image processing failed");
          setUploading(false);
          message.error("Failed to process image. Please try again.");
          return;
        }
        console.log("Image processed successfully");
      }

      // Combine phone fields
      const phone = values.phoneCountryCode && values.phoneNumber 
        ? `${values.phoneCountryCode}${values.phoneNumber}` 
        : values.phone || "";
      const countryPhone = values.countryPhoneCountryCode && values.countryPhoneNumber 
        ? `${values.countryPhoneCountryCode}${values.countryPhoneNumber}` 
        : values.countryPhone || "";

      const organizerData = {
        organizerNumber: values.organizerNumber,
        licenseNumber: values.licenseNumber,
        company: values.company,
        hajjCount: Number(values.hajjCount) || 0,
        organizerNationality: values.organizerNationality || "",
        nationality: values.nationality,
        gender: values.gender,
        phone: phone,
        phoneCountryCode: values.phoneCountryCode || "",
        phoneNumber: values.phoneNumber || "",
        countryPhone: countryPhone,
        countryPhoneCountryCode: values.countryPhoneCountryCode || "",
        countryPhoneNumber: values.countryPhoneNumber || "",
        passport: values.passport,
        email: values.email,
        imageURL: imageURL || undefined,
        createdAt: new Date(),
      };

      console.log("Saving organizer data:", organizerData);
      // Save to localStorage and merge with mock data
      console.log("Saving to local storage...");
      const newId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newOrganizer: Organizer = {
        id: newId,
        ...organizerData
      };
      const currentOrganizers = loadFromLocalStorageHelper();
      const mockData = mockOrganizers as Organizer[];
      
      // Create a map to avoid duplicates
      const organizersMap = new Map<string, Organizer>();
      
      // Add mock data first
      mockData.forEach((org) => {
        organizersMap.set(org.organizerNumber, org);
      });
      
      // Add existing localStorage data
      currentOrganizers.forEach((org) => {
        organizersMap.set(org.organizerNumber, org);
      });
      
      // Add new organizer (will override if duplicate organizerNumber)
      organizersMap.set(newOrganizer.organizerNumber, newOrganizer);
      
      const mergedOrganizers = Array.from(organizersMap.values());
      saveToLocalStorageHelper(mergedOrganizers);
      setOrganizers(mergedOrganizers);
      message.success("Organizer saved locally!");
      form.resetFields();
      setImageFile(null);
      setModalVisible(false);
      setUploading(false);
      await fetchOrganizers();
    } catch (error: any) {
      console.error("Error adding organizer:", error);
      console.error("Error type:", typeof error);
      console.error("Error constructor:", error?.constructor?.name);
      console.error("Error details:", {
        code: error?.code,
        message: error?.message,
        stack: error?.stack,
        name: error?.name
      });
      
      let errorMessage = "Failed to add organizer";
      if (error?.code === "invalid-argument") {
        errorMessage = "Invalid data. Please check all fields are filled correctly.";
      } else if (error?.message) {
        errorMessage = `Error: ${error.message}`;
      } else if (error?.toString) {
        errorMessage = `Error: ${error.toString()}`;
      }
      
      message.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  // Show details modal
  const showDetailsModal = (organizer: Organizer) => {
    setSelectedOrganizer(organizer);
    setDetailsModalVisible(true);
  };

  // Show edit modal
  const showEditModal = (organizer: Organizer) => {
    setSelectedOrganizer(organizer);
    setEditModalVisible(true);
    // Fill form with organizer data
    form.setFieldsValue({
      organizerNumber: organizer.organizerNumber,
      licenseNumber: organizer.licenseNumber,
      company: organizer.company,
      hajjCount: organizer.hajjCount,
      organizerNationality: organizer.organizerNationality || "",
      nationality: organizer.nationality,
      gender: organizer.gender,
      phoneCountryCode: organizer.phoneCountryCode || organizer.phone?.split(" ")[0],
      phoneNumber: organizer.phoneNumber || organizer.phone?.split(" ").slice(1).join(" "),
      countryPhoneCountryCode: organizer.countryPhoneCountryCode || organizer.countryPhone?.split(" ")[0],
      countryPhoneNumber: organizer.countryPhoneNumber || organizer.countryPhone?.split(" ").slice(1).join(" "),
      passport: organizer.passport,
      email: organizer.email,
    });
  };

  // Handle edit form submission
  const handleEditSubmit = async (values: any) => {
    if (!selectedOrganizer) {
      message.error("Organizer not selected.");
      return;
    }

    setUploading(true);
    try {
      let imageURL: string | undefined = selectedOrganizer.imageURL || undefined;
      if (imageFile) {
        if (storage) {
          const uploadedURL = await handleImageUpload(imageFile);
          if (uploadedURL) {
            imageURL = uploadedURL;
          } else {
            setUploading(false);
            return;
          }
        } else {
          console.warn("Storage not configured, keeping existing image");
        }
      }

      const phone = values.phoneCountryCode && values.phoneNumber
        ? `${values.phoneCountryCode}${values.phoneNumber}`
        : values.phone || "";
      const countryPhone = values.countryPhoneCountryCode && values.countryPhoneNumber
        ? `${values.countryPhoneCountryCode}${values.countryPhoneNumber}`
        : values.countryPhone || "";

      const organizerData = {
        organizerNumber: values.organizerNumber,
        licenseNumber: values.licenseNumber,
        company: values.company,
        hajjCount: Number(values.hajjCount) || 0,
        organizerNationality: values.organizerNationality || "",
        nationality: values.nationality,
        gender: values.gender,
        phone: phone,
        phoneCountryCode: values.phoneCountryCode || "",
        phoneNumber: values.phoneNumber || "",
        countryPhone: countryPhone,
        countryPhoneCountryCode: values.countryPhoneCountryCode || "",
        countryPhoneNumber: values.countryPhoneNumber || "",
        passport: values.passport,
        email: values.email,
        imageURL: imageURL || undefined,
        createdAt: selectedOrganizer.createdAt,
      };

      // Update in localStorage
      const currentOrganizers = loadFromLocalStorageHelper();
      const updatedOrganizers = currentOrganizers.map((org) =>
        org.id === selectedOrganizer.id ? { ...org, ...organizerData } : org
      );
      saveToLocalStorageHelper(updatedOrganizers);
      setOrganizers(updatedOrganizers);


      message.success("Organizer updated successfully!");
      form.resetFields();
      setImageFile(null);
      setEditModalVisible(false);
      setSelectedOrganizer(null);
      await fetchOrganizers();
    } catch (error: any) {
      console.error("Error updating organizer:", error);
      message.error("Failed to update organizer");
    } finally {
      setUploading(false);
    }
  };

  // Handle delete organizer - show confirmation modal
  const handleDeleteOrganizer = () => {
    console.log("handleDeleteOrganizer called", selectedOrganizer);
    
    if (!selectedOrganizer) {
      message.error("Organizer not selected.");
      return;
    }

    setDeleteConfirmVisible(true);
  };

  // Execute delete after confirmation
  const confirmDeleteOrganizer = async () => {
    if (!selectedOrganizer) {
      return;
    }

    try {
      console.log("Deleting organizer:", selectedOrganizer.id, selectedOrganizer.organizerNumber);
      
      // Delete from current organizers state (this includes merged data)
      const currentOrganizers = [...organizers];
      const filteredOrganizers = currentOrganizers.filter(
        (org) => {
          // Match by id if available, otherwise match by organizerNumber
          if (selectedOrganizer.id && org.id) {
            return org.id !== selectedOrganizer.id;
          }
          return org.organizerNumber !== selectedOrganizer.organizerNumber;
        }
      );
      
      console.log(`Before delete: ${currentOrganizers.length}, After delete: ${filteredOrganizers.length}`);
      
      // Update state immediately
      setOrganizers(filteredOrganizers);
      
      // Delete from localStorage
      const storedOrganizers = loadFromLocalStorageHelper();
      const filteredStored = storedOrganizers.filter(
        (org) => {
          if (selectedOrganizer.id && org.id) {
            return org.id !== selectedOrganizer.id;
          }
          return org.organizerNumber !== selectedOrganizer.organizerNumber;
        }
      );
      saveToLocalStorageHelper(filteredStored);
      console.log("Deleted from localStorage");


      message.success(t("organizerDeleted") || "Organizer deleted successfully");
      setDeleteConfirmVisible(false);
      setDetailsModalVisible(false);
      setSelectedOrganizer(null);
    } catch (error) {
      console.error("Error deleting organizer:", error);
      message.error(t("deleteError") || "Failed to delete organizer");
    }
  };

  // Handle organizer count click - show all organizers
  const handleCountClick = () => {
    const cardsSection = document.getElementById("organizers-cards");
    if (cardsSection) {
      cardsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Export organizers data to CSV
  const handleExport = () => {
    try {
      // Prepare CSV data
      const headers = [
        "Organizer Number",
        "License Number",
        "Company",
        "Hajj Count",
        "Organizer Nationality",
        "Hajj Nationality",
        "Gender",
        "Phone Country Code",
        "Phone Number",
        "Country Phone Country Code",
        "Country Phone Number",
        "Email",
        "Passport",
        "Image URL",
        "Created At"
      ];

      const csvRows = [
        headers.join(","),
        ...organizers.map(org => {
          return [
            org.organizerNumber || "",
            org.licenseNumber || "",
            org.company || "",
            org.hajjCount || "",
            org.organizerNationality || "",
            org.nationality || "",
            org.gender || "",
            org.phoneCountryCode || "",
            org.phoneNumber || "",
            org.countryPhoneCountryCode || "",
            org.countryPhoneNumber || "",
            org.email || "",
            org.passport || "",
            org.imageURL || "",
            org.createdAt ? (org.createdAt instanceof Date ? org.createdAt.toISOString() : typeof org.createdAt === 'string' ? org.createdAt : new Date(org.createdAt).toISOString()) : ""
          ].map(field => {
            // Escape commas and quotes in CSV
            const stringField = String(field || "");
            if (stringField.includes(",") || stringField.includes('"') || stringField.includes("\n")) {
              return `"${stringField.replace(/"/g, '""')}"`;
            }
            return stringField;
          }).join(",");
        })
      ];

      const csvContent = csvRows.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      link.setAttribute("href", url);
      link.setAttribute("download", `organizers_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      message.success(t("exportSuccess") || "تم تصدير البيانات بنجاح");
    } catch (error) {
      console.error("Export error:", error);
      message.error(t("exportError") || "فشل تصدير البيانات");
    }
  };

  // Import organizers data from CSV
  const handleImport = () => {
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".csv";
      input.onchange = async (e: Event) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        if (!file) return;

        try {
          const text = await file.text();
          const lines = text.split("\n");
          
          if (lines.length < 2) {
            message.error(t("importError") || "الملف فارغ أو غير صحيح");
            return;
          }

          // Parse headers
          const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
          
          // Parse data rows
          const importedOrganizers: Organizer[] = [];
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // Simple CSV parsing (handles quoted fields)
            const values: string[] = [];
            let currentValue = "";
            let inQuotes = false;
            
            for (let j = 0; j < line.length; j++) {
              const char = line[j];
              if (char === '"') {
                if (inQuotes && line[j + 1] === '"') {
                  currentValue += '"';
                  j++;
                } else {
                  inQuotes = !inQuotes;
                }
              } else if (char === "," && !inQuotes) {
                values.push(currentValue.trim());
                currentValue = "";
              } else {
                currentValue += char;
              }
            }
            values.push(currentValue.trim());

            if (values.length !== headers.length) continue;

            // Map values to organizer object
            const organizerData: any = {};
            headers.forEach((header, index) => {
              const value = values[index] || "";
              organizerData[header.toLowerCase().replace(/\s+/g, "")] = value;
            });

            // Convert to Organizer format
            const organizer: Organizer = {
              id: `imported_${Date.now()}_${i}`,
              organizerNumber: organizerData.organizernumber || "",
              licenseNumber: organizerData.licensenumber || "",
              company: organizerData.company || "",
              hajjCount: Number(organizerData.hajjcount) || 0,
              organizerNationality: organizerData.organizernationality || "",
              nationality: organizerData.hajjnationality || "",
              gender: organizerData.gender || "Male",
              phoneCountryCode: organizerData.phonecountrycode || "",
              phoneNumber: organizerData.phonenumber || "",
              phone: `${organizerData.phonecountrycode || ""} ${organizerData.phonenumber || ""}`.trim(),
              countryPhoneCountryCode: organizerData.countryphonecountrycode || "",
              countryPhoneNumber: organizerData.countryphonenumber || "",
              countryPhone: `${organizerData.countryphonecountrycode || ""} ${organizerData.countryphonenumber || ""}`.trim(),
              passport: organizerData.passport || "",
              email: organizerData.email || "",
              imageURL: organizerData.imageurl || undefined,
              createdAt: new Date(),
            };

            importedOrganizers.push(organizer);
          }

          if (importedOrganizers.length === 0) {
            message.error(t("importError") || "لم يتم العثور على بيانات صحيحة في الملف");
            return;
          }

          // Merge with existing organizers
          const updatedOrganizers = [...organizers, ...importedOrganizers];
          setOrganizers(updatedOrganizers);
          saveToLocalStorageHelper(updatedOrganizers);
          
          message.success(t("importSuccess") || `تم استيراد ${importedOrganizers.length} منظم بنجاح`);
        } catch (error) {
          console.error("Import error:", error);
          message.error(t("importError") || "فشل استيراد البيانات");
        }
      };
      input.click();
    } catch (error) {
      console.error("Import error:", error);
      message.error(t("importError") || "فشل استيراد البيانات");
    }
  };


  return (
    <div className="p-3 sm:p-4 md:p-5 lg:p-6 space-y-4 sm:space-y-5 md:space-y-6 overflow-x-hidden">
      {/* Header with Add Button */}
      <OrganizersHeader 
        onAddClick={() => setModalVisible(true)} 
        onExport={handleExport}
        onImport={handleImport}
        t={t} 
      />

      {/* Statistics Overview Cards */}
      <StatisticsCards
        totalCount={organizers.length}
        nationalitiesCount={nationalities.length}
        maleCount={maleCount}
        femaleCount={femaleCount}
        onTotalClick={handleCountClick}
        onMaleClick={() => handleGenderClick("Male")}
        onFemaleClick={() => handleGenderClick("Female")}
        t={t}
      />

      {/* Filter Section */}
      <SearchAndFilter
        searchText={searchText}
        searchType={searchType}
        showSearchOptions={showSearchOptions}
        filteredCount={filteredOrganizers.length}
        totalCount={organizers.length}
        onSearchChange={(value) => setSearchText(value)}
        onSearchTypeChange={(value) => setSearchType(value)}
        onShowSearchOptionsChange={setShowSearchOptions}
        onClearSearch={() => setSearchText("")}
        t={t}
      />

      {/* Organizers Cards Section */}
      <div id="organizers-cards">
        {loading ? (
          <div className="flex justify-center items-center py-10 sm:py-16 md:py-20">
            <Spin size="large" />
          </div>
        ) : filteredOrganizers.length === 0 ? (
          <Card className="text-center py-6 sm:py-8 md:py-10">
            <Text type="secondary" className="text-base sm:text-lg">
              {searchText ? t("noResultsFound") : t("noOrganizers")}
            </Text>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-3">
            {filteredOrganizers.map((organizer) => (
              <OrganizerCard
                key={organizer.id}
                organizer={organizer}
                onShowDetails={showDetailsModal}
                translateNationality={translateNationality}
                translateGender={translateGender}
                t={t}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Organizer Modal */}
      <AddOrganizerModal
        visible={modalVisible}
        form={form}
        uploading={uploading}
        imageFile={imageFile}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setImageFile(null);
        }}
        onSubmit={handleSubmit}
        onImageChange={setImageFile}
        t={t}
      />

      {/* Details Modal */}
      <OrganizerDetailsModal
        visible={detailsModalVisible}
        organizer={selectedOrganizer}
        onCancel={() => {
          setDetailsModalVisible(false);
          setSelectedOrganizer(null);
        }}
        onEdit={() => {
          if (selectedOrganizer) {
            setDetailsModalVisible(false);
            showEditModal(selectedOrganizer);
          }
        }}
        onDelete={handleDeleteOrganizer}
        translateNationality={translateNationality}
        translateGender={translateGender}
        t={t}
      />

      {/* Edit Organizer Modal */}
      <EditOrganizerModal
        visible={editModalVisible}
        form={form}
        uploading={uploading}
        imageFile={imageFile}
        selectedOrganizer={selectedOrganizer}
        onCancel={() => {
          setEditModalVisible(false);
          setSelectedOrganizer(null);
          form.resetFields();
          setImageFile(null);
        }}
        onSubmit={handleEditSubmit}
        onImageChange={setImageFile}
        t={t}
      />

      {/* Nationality Details Modal */}
      <NationalityModal
        visible={nationalityModalVisible}
        nationality={selectedNationality}
        organizers={organizers}
        onCancel={() => {
          setNationalityModalVisible(false);
          setSelectedNationality("");
        }}
        translateNationality={translateNationality}
        getHajjCountByNationality={getHajjCountByNationality}
        t={t}
      />

      {/* Gender Details Modal */}
      <GenderModal
        visible={genderModalVisible}
        gender={selectedGender}
        organizers={organizers}
        onCancel={() => {
          setGenderModalVisible(false);
          setSelectedGender("");
        }}
        translateNationality={translateNationality}
        getOrganizersByGender={getOrganizersByGender}
        getHajjCountByGender={getHajjCountByGender}
        t={t}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        visible={deleteConfirmVisible}
        organizer={selectedOrganizer}
        onCancel={() => {
          setDeleteConfirmVisible(false);
        }}
        onConfirm={confirmDeleteOrganizer}
        t={t}
      />
    </div>
  );
};

export default OrganizersPage;

