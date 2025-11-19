import { useState, useEffect } from "react";
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  message,
  Typography,
  Space,
  Tag,
  Image,
  Spin,
} from "antd";
import {
  PlusOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  IdcardOutlined,
  BankOutlined,
  TeamOutlined,
  ManOutlined,
  WomanOutlined,
  EyeOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../config/firebase";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;
const { Option } = Select;

// Country codes for phone numbers
const countryCodes = [
  { code: "+966", country: "Saudi Arabia" },
  { code: "+971", country: "UAE" },
  { code: "+965", country: "Kuwait" },
  { code: "+974", country: "Qatar" },
  { code: "+973", country: "Bahrain" },
  { code: "+968", country: "Oman" },
  { code: "+961", country: "Lebanon" },
  { code: "+962", country: "Jordan" },
  { code: "+963", country: "Syria" },
  { code: "+964", country: "Iraq" },
  { code: "+20", country: "Egypt" },
  { code: "+212", country: "Morocco" },
  { code: "+213", country: "Algeria" },
  { code: "+216", country: "Tunisia" },
  { code: "+218", country: "Libya" },
  { code: "+249", country: "Sudan" },
  { code: "+967", country: "Yemen" },
  { code: "+92", country: "Pakistan" },
  { code: "+91", country: "India" },
  { code: "+62", country: "Indonesia" },
  { code: "+90", country: "Turkey" },
  { code: "+1", country: "USA/Canada" },
  { code: "+44", country: "UK" },
  { code: "+33", country: "France" },
  { code: "+49", country: "Germany" },
  { code: "+39", country: "Italy" },
  { code: "+34", country: "Spain" },
  { code: "+7", country: "Russia" },
  { code: "+86", country: "China" },
  { code: "+81", country: "Japan" },
  { code: "+82", country: "South Korea" },
];

interface Organizer {
  id: string;
  organizerNumber: string;
  licenseNumber: string;
  company: string;
  hajjCount: number;
  nationality: string;
  gender: string;
  phoneCountryCode?: string;
  phoneNumber?: string;
  phone?: string; // For backward compatibility
  countryPhoneCountryCode?: string;
  countryPhoneNumber?: string;
  countryPhone?: string; // For backward compatibility
  passport: string;
  email: string;
  imageURL?: string;
  createdAt: Timestamp;
}

const OrganizersPage = () => {
  const { t } = useTranslation("common");
  const [form] = Form.useForm();
  
  // Translate nationality function
  const translateNationality = (nationality: string): string => {
    if (!nationality) return nationality;
    try {
      const translationKey = `nationalities.${nationality}`;
      const translated = t(translationKey, { defaultValue: nationality });
      // If translation exists and is different from the key, return it
      if (translated && translated !== translationKey && translated !== nationality) {
        return translated;
      }
    } catch (error) {
      console.warn("Translation error for nationality:", nationality, error);
    }
    // Otherwise return the original nationality
    return nationality;
  };
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [nationalityModalVisible, setNationalityModalVisible] = useState(false);
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [selectedNationality, setSelectedNationality] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [selectedOrganizer, setSelectedOrganizer] = useState<Organizer | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Local storage helpers
  const STORAGE_KEY = "organizers_data";
  
  const saveToLocalStorage = (data: Organizer[]) => {
    try {
      const dataToSave = data.map((org) => ({
        ...org,
        createdAt: org.createdAt ? {
          seconds: org.createdAt.seconds || Date.now() / 1000,
          nanoseconds: org.createdAt.nanoseconds || 0
        } : { seconds: Date.now() / 1000, nanoseconds: 0 }
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  const loadFromLocalStorage = (): Organizer[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((org: any) => {
          let createdAt = Timestamp.now();
          if (org.createdAt) {
            if (org.createdAt.seconds) {
              createdAt = Timestamp.fromMillis(org.createdAt.seconds * 1000);
            } else if (typeof org.createdAt === 'number') {
              createdAt = Timestamp.fromMillis(org.createdAt);
            }
          }
          return {
            ...org,
            createdAt
          };
        });
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
    }
    return [];
  };

  // Fetch organizers from Firebase or localStorage
  const fetchOrganizers = async () => {
    if (!db) {
      console.warn("Firebase is not initialized. Using local storage.");
      setLoading(true);
      try {
        const localData = loadFromLocalStorage();
        console.log(`Loaded ${localData.length} organizers from local storage`);
        setOrganizers(localData);
      } catch (error) {
        console.error("Error loading from local storage:", error);
        message.error("Failed to load organizers");
      } finally {
        setLoading(false);
      }
      return;
    }
    
    setLoading(true);
    try {
      console.log("Fetching organizers from Firebase...");
      const q = query(collection(db, "organizers"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const organizersData: Organizer[] = [];
      querySnapshot.forEach((doc) => {
        organizersData.push({ id: doc.id, ...doc.data() } as Organizer);
      });
      console.log(`Fetched ${organizersData.length} organizers`);
      setOrganizers(organizersData);
      // Also save to localStorage as backup
      saveToLocalStorage(organizersData);
    } catch (error: any) {
      console.error("Error fetching organizers:", error);
      // Fallback to localStorage
      console.log("Falling back to local storage...");
      const localData = loadFromLocalStorage();
      setOrganizers(localData);
      message.warning("Using local storage data. Firebase connection failed.");
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

  // Calculate gender counts
  const maleCount = organizers.filter((org) => org.gender === "Male").length;
  const femaleCount = organizers.filter((org) => org.gender === "Female").length;

  // Calculate total hajj count for a specific nationality
  const getHajjCountByNationality = (nationality: string): number => {
    return organizers
      .filter((org) => org.nationality === nationality)
      .reduce((total, org) => total + (org.hajjCount || 0), 0);
  };

  // Handle nationality click
  const handleNationalityClick = (nationality: string) => {
    setSelectedNationality(nationality);
    setNationalityModalVisible(true);
  };

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

  // Handle image upload
  const handleImageUpload = async (file: File): Promise<string | null> => {
    if (!storage) {
      console.warn("Firebase Storage is not initialized.");
      message.warning("Firebase Storage is not configured.");
      return null;
    }
    
    try {
      const storageRef = ref(storage, `organizers/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      message.error("Failed to upload image");
      return null;
    }
  };

  // Handle form submission
  const handleSubmit = async (values: any) => {
    console.log("Form submitted with values:", values);
    
    // Don't block if Firebase is not initialized - use localStorage instead
    if (!db) {
      console.log("Firebase db is not initialized, using local storage");
    }
    
    setUploading(true);
    try {
      let imageURL = null;
      if (imageFile) {
        if (storage) {
          console.log("Uploading image...");
          imageURL = await handleImageUpload(imageFile);
          if (!imageURL) {
            console.error("Image upload failed");
            setUploading(false);
            message.error("Failed to upload image. Please try again.");
            return;
          }
          console.log("Image uploaded successfully:", imageURL);
        } else {
          // If storage is not configured, continue without image
          console.warn("Storage not configured, saving without image");
        }
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
        createdAt: Timestamp.now(),
      };

      console.log("Saving organizer data:", organizerData);
      console.log("DB object:", db);
      console.log("Collection path:", "organizers");
      
      // Save to Firebase if available, otherwise save to localStorage
      if (db && typeof db === 'object') {
        try {
          console.log("Attempting to add document to Firebase...");
          const docRef = await addDoc(collection(db, "organizers"), organizerData);
          console.log("Organizer saved to Firebase with ID:", docRef.id);
          
          // Also save to localStorage as backup
          const newOrganizer: Organizer = {
            id: docRef.id,
            ...organizerData
          };
          const currentOrganizers = loadFromLocalStorage();
          currentOrganizers.unshift(newOrganizer);
          saveToLocalStorage(currentOrganizers);
        } catch (addDocError: any) {
          console.error("addDoc error:", addDocError);
          // Fallback to localStorage
          console.log("Falling back to local storage...");
          const newId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          const newOrganizer: Organizer = {
            id: newId,
            ...organizerData
          };
          const currentOrganizers = loadFromLocalStorage();
          currentOrganizers.unshift(newOrganizer);
          saveToLocalStorage(currentOrganizers);
          setOrganizers([...currentOrganizers]);
          message.success("Organizer saved locally (Firebase unavailable)!");
          form.resetFields();
          setImageFile(null);
          setModalVisible(false);
          setUploading(false);
          return;
        }
      } else {
        // Save to localStorage only
        console.log("Saving to local storage only...");
        const newId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newOrganizer: Organizer = {
          id: newId,
          ...organizerData
        };
        const currentOrganizers = loadFromLocalStorage();
        currentOrganizers.unshift(newOrganizer);
        saveToLocalStorage(currentOrganizers);
        setOrganizers([...currentOrganizers]);
        message.success("Organizer saved locally!");
        form.resetFields();
        setImageFile(null);
        setModalVisible(false);
        setUploading(false);
        return;
      }
      
      // If we reach here, Firebase save was successful
      message.success("Organizer added successfully!");
      form.resetFields();
      setImageFile(null);
      setModalVisible(false);
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
      if (error?.code === "permission-denied") {
        errorMessage = "Permission denied. Please check your Firebase rules.";
      } else if (error?.code === "unavailable") {
        errorMessage = "Firebase service is unavailable. Please check your connection.";
      } else if (error?.code === "invalid-argument") {
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

  // Handle organizer count click - show all organizers
  const handleCountClick = () => {
    const cardsSection = document.getElementById("organizers-cards");
    if (cardsSection) {
      cardsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <Title level={2} className="text-mainColor mb-0">
          {t("organizersTitle")}
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => setModalVisible(true)}
          className="bg-mainColor border-mainColor hover:bg-primary hover:border-primary"
        >
          {t("addOrganizer")}
        </Button>
      </div>

      {/* Organizer Count + Nationalities Overview Card */}
      <Card className="shadow-lg rounded-lg">
        <div className="space-y-4">
          <div
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleCountClick}
          >
            <Title level={3} className="text-mainColor mb-2">
              {t("organizers")}: <span className="text-3xl">{organizers.length}</span>
            </Title>
          </div>
          <div>
            <Text strong className="text-gray-700">
              {t("nationalitiesLabel")}:{" "}
            </Text>
            <Space wrap>
              {nationalities.length > 0 ? (
                nationalities.map((nationality) => (
                  <Tag
                    key={nationality}
                    color="blue"
                    className="text-sm py-1 px-3 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleNationalityClick(nationality)}
                  >
                    {translateNationality(nationality)}
                  </Tag>
                ))
              ) : (
                <Text type="secondary">{t("noNationalities")}</Text>
              )}
            </Space>
          </div>

          {/* Gender Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card 
              className="text-center border-2 border-blue-200 hover:border-blue-400 transition-colors cursor-pointer"
              onClick={() => handleGenderClick("Male")}
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <ManOutlined className="text-2xl text-blue-600" />
                <div>
                  <div className="text-3xl font-bold text-mainColor">
                    {maleCount}
                  </div>
                  <div className="text-sm text-gray-600">{t("maleOrganizers")}</div>
                </div>
              </div>
            </Card>
            <Card 
              className="text-center border-2 border-pink-200 hover:border-pink-400 transition-colors cursor-pointer"
              onClick={() => handleGenderClick("Female")}
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <WomanOutlined className="text-2xl text-pink-600" />
                <div>
                  <div className="text-3xl font-bold text-mainColor">
                    {femaleCount}
                  </div>
                  <div className="text-sm text-gray-600">{t("femaleOrganizers")}</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Card>

      {/* Organizers Cards Section */}
      <div id="organizers-cards">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spin size="large" />
          </div>
        ) : organizers.length === 0 ? (
          <Card className="text-center py-10">
            <Text type="secondary" className="text-lg">
              {t("noOrganizers")}
            </Text>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {organizers.map((organizer) => {
              return (
                <Card
                  key={organizer.id}
                  className="shadow-sm rounded-xl hover:shadow-md transition-all duration-300 border border-gray-100"
                  bodyStyle={{ padding: "12px" }}
                  actions={[
                    <Button
                      type="text"
                      size="small"
                      icon={<EyeOutlined />}
                      onClick={() => showDetailsModal(organizer)}
                      className="w-full"
                    >
                      {t("showDetails")}
                    </Button>,
                  ]}
                >
                  <div className="space-y-2">
                    {/* Preview Image or Default Avatar */}
                    <div className="mb-2 flex justify-center pb-2 border-b border-gray-200">
                      {organizer.imageURL ? (
                        <Image
                          src={organizer.imageURL}
                          alt={organizer.company}
                          className="rounded-lg"
                          width="100%"
                          height={70}
                          style={{ objectFit: "cover" }}
                          preview={false}
                        />
                      ) : (
                        <img
                          src={organizer.gender === "Male" ? "/images/male.png" : "/images/female.png"}
                          alt={organizer.gender === "Male" ? "Male" : "Female"}
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "contain",
                            borderRadius: "6px",
                          }}
                        />
                      )}
                    </div>

                    {/* Basic Info - Only Required Fields */}
                    <div className="space-y-1 pt-1">
                      <div className="flex items-start gap-1.5">
                        <IdcardOutlined className="text-mainColor text-xs mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <Text className="text-xs text-gray-500 block leading-tight">{t("organizerNumber")}</Text>
                          <Text className="text-xs font-medium block truncate">{organizer.organizerNumber}</Text>
                        </div>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <BankOutlined className="text-mainColor text-xs mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <Text className="text-xs text-gray-500 block leading-tight">{t("licenseNumber")}</Text>
                          <Text className="text-xs font-medium block truncate">{organizer.licenseNumber}</Text>
                        </div>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <TeamOutlined className="text-mainColor text-xs mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <Text className="text-xs text-gray-500 block leading-tight">{t("companyName")}</Text>
                          <Text className="text-xs font-medium block truncate">{organizer.company}</Text>
                        </div>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <UserOutlined className="text-mainColor text-xs mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <Text className="text-xs text-gray-500 block leading-tight">{t("hajjCount")}</Text>
                          <Text className="text-xs font-medium">{organizer.hajjCount}</Text>
                        </div>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <GlobalOutlined className="text-mainColor text-xs mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <Text className="text-xs text-gray-500 block leading-tight">{t("nationality")}</Text>
                          <Tag color="blue" className="text-xs mt-0.5">{translateNationality(organizer.nationality)}</Tag>
                        </div>
                      </div>
                    </div>

                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Organizer Modal */}
      <Modal
        title={t("addOrganizer")}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setImageFile(null);
        }}
        footer={null}
        width={900}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="organizerNumber"
              label={t("organizerNumber")}
              rules={[{ required: true, message: t("requiredField") }]}
            >
              <Input prefix={<IdcardOutlined />} />
            </Form.Item>

            <Form.Item
              name="licenseNumber"
              label={t("licenseNumber")}
              rules={[{ required: true, message: t("requiredField") }]}
            >
              <Input prefix={<BankOutlined />} />
            </Form.Item>

            <Form.Item
              name="company"
              label={t("companyName")}
              rules={[{ required: true, message: t("requiredField") }]}
            >
              <Input prefix={<TeamOutlined />} />
            </Form.Item>

            <Form.Item
              name="hajjCount"
              label={t("hajjCount")}
              rules={[
                { required: true, message: t("requiredField") },
                {
                  validator: (_, value) => {
                    const numValue = Number(value);
                    if (isNaN(numValue) || numValue < 0) {
                      return Promise.reject(new Error(t("invalidNumber")));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input type="number" min={0} />
            </Form.Item>

            <Form.Item
              name="nationality"
              label={t("nationality")}
              rules={[{ required: true, message: t("requiredField") }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="gender"
              label={t("gender")}
              rules={[{ required: true, message: t("requiredField") }]}
            >
              <Select placeholder={t("selectGender")}>
                <Option value="Male">{t("male")}</Option>
                <Option value="Female">{t("female")}</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label={t("phone")}
              required
            >
              <Input.Group compact style={{ display: "flex", direction: "ltr" }}>
                <Form.Item
                  name="phoneCountryCode"
                  rules={[{ required: true, message: t("requiredField") }]}
                  style={{ width: "35%", marginRight: 0, marginBottom: 0 }}
                >
                  <Select
                    placeholder={t("countryCode")}
                    showSearch
                    filterOption={(input, option) => {
                      const text = String(option?.children || option?.value || "").toLowerCase();
                      return text.includes(input.toLowerCase());
                    }}
                    style={{ textAlign: "left", direction: "ltr" }}
                    className="country-code-select"
                  >
                    {countryCodes.map((country) => (
                      <Option key={country.code} value={country.code}>
                        <div style={{ textAlign: "left", direction: "ltr" }}>
                          <span style={{ fontWeight: "bold" }}>{country.code}</span>
                          <span className="ml-2 text-gray-500">{country.country}</span>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="phoneNumber"
                  rules={[{ required: true, message: t("requiredField") }]}
                  style={{ width: "65%", marginBottom: 0 }}
                >
                  <Input placeholder={t("phoneNumber")} />
                </Form.Item>
              </Input.Group>
            </Form.Item>

            <Form.Item
              label={t("countryPhone")}
              required
            >
              <Input.Group compact style={{ display: "flex", direction: "ltr" }}>
                <Form.Item
                  name="countryPhoneCountryCode"
                  rules={[{ required: true, message: t("requiredField") }]}
                  style={{ width: "35%", marginRight: 0, marginBottom: 0 }}
                >
                  <Select
                    placeholder={t("countryCode")}
                    showSearch
                    filterOption={(input, option) => {
                      const text = String(option?.children || option?.value || "").toLowerCase();
                      return text.includes(input.toLowerCase());
                    }}
                    style={{ textAlign: "left", direction: "ltr" }}
                    className="country-code-select"
                  >
                    {countryCodes.map((country) => (
                      <Option key={country.code} value={country.code}>
                        <div style={{ textAlign: "left", direction: "ltr" }}>
                          <span style={{ fontWeight: "bold" }}>{country.code}</span>
                          <span className="ml-2 text-gray-500">{country.country}</span>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="countryPhoneNumber"
                  rules={[{ required: true, message: t("requiredField") }]}
                  style={{ width: "65%", marginBottom: 0 }}
                >
                  <Input placeholder={t("phoneNumber")} />
                </Form.Item>
              </Input.Group>
            </Form.Item>

            <Form.Item
              name="passport"
              label={t("passport")}
              rules={[{ required: true, message: t("requiredField") }]}
            >
              <Input prefix={<IdcardOutlined />} />
            </Form.Item>

            <Form.Item
              name="email"
              label={t("email")}
              rules={[
                { required: true, message: t("requiredField") },
                { type: "email", message: t("invalidEmail") },
              ]}
            >
              <Input prefix={<MailOutlined />} type="email" />
            </Form.Item>
          </div>

          <Form.Item label={t("imageUpload")} className="mt-2">
            <Upload
              beforeUpload={(file) => {
                setImageFile(file);
                return false;
              }}
              onRemove={() => setImageFile(null)}
              maxCount={1}
              accept="image/*"
            >
              <Button icon={<PlusOutlined />}>{t("uploadImage")}</Button>
            </Upload>
          </Form.Item>

          <Form.Item className="mb-0">
            <Button
              type="primary"
              htmlType="submit"
              loading={uploading}
              block
              size="large"
              className="bg-mainColor border-mainColor hover:bg-primary hover:border-primary"
            >
              {t("saveOrganizer")}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Details Modal */}
      <Modal
        title={t("organizerDetails")}
        open={detailsModalVisible}
        onCancel={() => {
          setDetailsModalVisible(false);
          setSelectedOrganizer(null);
        }}
        footer={[
          <Button
            key="edit"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              if (selectedOrganizer) {
                setDetailsModalVisible(false);
                showEditModal(selectedOrganizer);
              }
            }}
            className="bg-mainColor border-mainColor hover:bg-primary hover:border-primary"
          >
            {t("editOrganizer")}
          </Button>,
        ]}
        width={900}
      >
        {selectedOrganizer && (
          <div className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Image */}
              <div className="col-span-2 mb-4 flex justify-center">
                {selectedOrganizer.imageURL ? (
                  <Image
                    src={selectedOrganizer.imageURL}
                    alt={selectedOrganizer.company}
                    className="rounded-lg"
                    width={200}
                    height={200}
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <img
                    src={selectedOrganizer.gender === "Male" ? "/images/male.png" : "/images/female.png"}
                    alt={selectedOrganizer.gender === "Male" ? "Male" : "Female"}
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "contain",
                      borderRadius: "8px",
                    }}
                  />
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <Text className="text-sm text-gray-500 block mb-1">{t("organizerNumber")}</Text>
                  <Text className="text-base font-medium">{selectedOrganizer.organizerNumber}</Text>
                </div>
                <div>
                  <Text className="text-sm text-gray-500 block mb-1">{t("licenseNumber")}</Text>
                  <Text className="text-base font-medium">{selectedOrganizer.licenseNumber}</Text>
                </div>
                <div>
                  <Text className="text-sm text-gray-500 block mb-1">{t("companyName")}</Text>
                  <Text className="text-base font-medium">{selectedOrganizer.company}</Text>
                </div>
                <div>
                  <Text className="text-sm text-gray-500 block mb-1">{t("hajjCount")}</Text>
                  <Text className="text-base font-medium">{selectedOrganizer.hajjCount}</Text>
                </div>
                <div>
                  <Text className="text-sm text-gray-500 block mb-1">{t("nationality")}</Text>
                  <Tag color="blue">{translateNationality(selectedOrganizer.nationality)}</Tag>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Text className="text-sm text-gray-500 block mb-1">{t("gender")}</Text>
                  <Text className="text-base font-medium">{selectedOrganizer.gender}</Text>
                </div>
                <div>
                  <Text className="text-sm text-gray-500 block mb-1">{t("phone")}</Text>
                  <Text className="text-base font-medium">
                    {selectedOrganizer.phoneCountryCode && selectedOrganizer.phoneNumber
                      ? `${selectedOrganizer.phoneCountryCode} ${selectedOrganizer.phoneNumber}`
                      : selectedOrganizer.phone || "N/A"}
                  </Text>
                </div>
                <div>
                  <Text className="text-sm text-gray-500 block mb-1">{t("countryPhone")}</Text>
                  <Text className="text-base font-medium">
                    {selectedOrganizer.countryPhoneCountryCode && selectedOrganizer.countryPhoneNumber
                      ? `${selectedOrganizer.countryPhoneCountryCode} ${selectedOrganizer.countryPhoneNumber}`
                      : selectedOrganizer.countryPhone || "N/A"}
                  </Text>
                </div>
                <div>
                  <Text className="text-sm text-gray-500 block mb-1">{t("email")}</Text>
                  <Text className="text-base font-medium break-all">{selectedOrganizer.email}</Text>
                </div>
                <div>
                  <Text className="text-sm text-gray-500 block mb-1">{t("passport")}</Text>
                  <Text className="text-base font-medium">{selectedOrganizer.passport}</Text>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Organizer Modal */}
      <Modal
        title={t("editOrganizer")}
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setSelectedOrganizer(null);
          form.resetFields();
          setImageFile(null);
        }}
        footer={null}
        width={900}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={async (values) => {
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
                  // If storage not available, continue without image update
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
              const currentOrganizers = loadFromLocalStorage();
              const updatedOrganizers = currentOrganizers.map((org) =>
                org.id === selectedOrganizer.id ? { ...org, ...organizerData } : org
              );
              saveToLocalStorage(updatedOrganizers);
              setOrganizers(updatedOrganizers);

              // Update in Firebase if available
              if (db && selectedOrganizer.id && !selectedOrganizer.id.startsWith("local_")) {
                try {
                  const { updateDoc, doc } = await import("firebase/firestore");
                  await updateDoc(doc(db, "organizers", selectedOrganizer.id), organizerData);
                  console.log("Updated in Firebase");
                } catch (error) {
                  console.warn("Firebase update failed, using local storage only:", error);
                }
              }

              message.success("Organizer updated successfully!");
              form.resetFields();
              setImageFile(null);
              setEditModalVisible(false);
              setSelectedOrganizer(null);
              // Refresh the list
              await fetchOrganizers();
            } catch (error: any) {
              console.error("Error updating organizer:", error);
              message.error("Failed to update organizer");
            } finally {
              setUploading(false);
            }
          }}
          className="mt-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="organizerNumber"
              label={t("organizerNumber")}
              rules={[{ required: true, message: t("requiredField") }]}
            >
              <Input prefix={<IdcardOutlined />} />
            </Form.Item>

            <Form.Item
              name="licenseNumber"
              label={t("licenseNumber")}
              rules={[{ required: true, message: t("requiredField") }]}
            >
              <Input prefix={<BankOutlined />} />
            </Form.Item>

            <Form.Item
              name="company"
              label={t("companyName")}
              rules={[{ required: true, message: t("requiredField") }]}
            >
              <Input prefix={<TeamOutlined />} />
            </Form.Item>

            <Form.Item
              name="hajjCount"
              label={t("hajjCount")}
              rules={[
                { required: true, message: t("requiredField") },
                {
                  validator: (_, value) => {
                    const numValue = Number(value);
                    if (isNaN(numValue) || numValue < 0) {
                      return Promise.reject(new Error(t("invalidNumber")));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input type="number" min={0} />
            </Form.Item>

            <Form.Item
              name="nationality"
              label={t("nationality")}
              rules={[{ required: true, message: t("requiredField") }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="gender"
              label={t("gender")}
              rules={[{ required: true, message: t("requiredField") }]}
            >
              <Select placeholder={t("selectGender")}>
                <Option value="Male">{t("male")}</Option>
                <Option value="Female">{t("female")}</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label={t("phone")}
              required
            >
              <Input.Group compact style={{ display: "flex", direction: "ltr" }}>
                <Form.Item
                  name="phoneCountryCode"
                  rules={[{ required: true, message: t("requiredField") }]}
                  style={{ width: "35%", marginRight: 0, marginBottom: 0 }}
                >
                  <Select
                    placeholder={t("countryCode")}
                    showSearch
                    filterOption={(input, option) => {
                      const text = String(option?.children || option?.value || "").toLowerCase();
                      return text.includes(input.toLowerCase());
                    }}
                    style={{ textAlign: "left", direction: "ltr" }}
                    className="country-code-select"
                  >
                    {countryCodes.map((country) => (
                      <Option key={country.code} value={country.code}>
                        <div style={{ textAlign: "left", direction: "ltr" }}>
                          <span style={{ fontWeight: "bold" }}>{country.code}</span>
                          <span className="ml-2 text-gray-500">{country.country}</span>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="phoneNumber"
                  rules={[{ required: true, message: t("requiredField") }]}
                  style={{ width: "65%", marginBottom: 0 }}
                >
                  <Input placeholder={t("phoneNumber")} />
                </Form.Item>
              </Input.Group>
            </Form.Item>

            <Form.Item
              label={t("countryPhone")}
              required
            >
              <Input.Group compact style={{ display: "flex", direction: "ltr" }}>
                <Form.Item
                  name="countryPhoneCountryCode"
                  rules={[{ required: true, message: t("requiredField") }]}
                  style={{ width: "35%", marginRight: 0, marginBottom: 0 }}
                >
                  <Select
                    placeholder={t("countryCode")}
                    showSearch
                    filterOption={(input, option) => {
                      const text = String(option?.children || option?.value || "").toLowerCase();
                      return text.includes(input.toLowerCase());
                    }}
                    style={{ textAlign: "left", direction: "ltr" }}
                    className="country-code-select"
                  >
                    {countryCodes.map((country) => (
                      <Option key={country.code} value={country.code}>
                        <div style={{ textAlign: "left", direction: "ltr" }}>
                          <span style={{ fontWeight: "bold" }}>{country.code}</span>
                          <span className="ml-2 text-gray-500">{country.country}</span>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="countryPhoneNumber"
                  rules={[{ required: true, message: t("requiredField") }]}
                  style={{ width: "65%", marginBottom: 0 }}
                >
                  <Input placeholder={t("phoneNumber")} />
                </Form.Item>
              </Input.Group>
            </Form.Item>

            <Form.Item
              name="passport"
              label={t("passport")}
              rules={[{ required: true, message: t("requiredField") }]}
            >
              <Input prefix={<IdcardOutlined />} />
            </Form.Item>

            <Form.Item
              name="email"
              label={t("email")}
              rules={[
                { required: true, message: t("requiredField") },
                { type: "email", message: t("invalidEmail") },
              ]}
            >
              <Input prefix={<MailOutlined />} type="email" />
            </Form.Item>
          </div>

          <Form.Item label={t("imageUpload")} className="mt-2">
            <Upload
              beforeUpload={(file) => {
                setImageFile(file);
                return false;
              }}
              onRemove={() => setImageFile(null)}
              maxCount={1}
              accept="image/*"
            >
              <Button icon={<PlusOutlined />}>{t("uploadImage")}</Button>
            </Upload>
          </Form.Item>

          <Form.Item className="mb-0">
            <Button
              type="primary"
              htmlType="submit"
              loading={uploading}
              block
              size="large"
              className="bg-mainColor border-mainColor hover:bg-primary hover:border-primary"
            >
              {t("updateOrganizer")}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Nationality Details Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <GlobalOutlined className="text-mainColor" />
            <span>{translateNationality(selectedNationality)}</span>
          </div>
        }
        open={nationalityModalVisible}
        onCancel={() => {
          setNationalityModalVisible(false);
          setSelectedNationality("");
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setNationalityModalVisible(false);
              setSelectedNationality("");
            }}
          >
            {t("close")}
          </Button>,
        ]}
        width={500}
      >
        {selectedNationality && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="text-center">
                <div className="text-3xl font-bold text-mainColor mb-2">
                  {organizers.filter((org) => org.nationality === selectedNationality).length}
                </div>
                <div className="text-sm text-gray-600">{t("organizers")}</div>
              </Card>
              <Card className="text-center">
                <div className="text-3xl font-bold text-mainColor mb-2">
                  {getHajjCountByNationality(selectedNationality)}
                </div>
                <div className="text-sm text-gray-600">{t("totalHajjCount")}</div>
              </Card>
            </div>
            <div>
              <Text strong className="text-gray-700 block mb-2">
                {t("organizersList")}:
              </Text>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {organizers
                  .filter((org) => org.nationality === selectedNationality)
                  .map((org) => (
                    <Card key={org.id} size="small" className="mb-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <Text strong className="block">{org.company}</Text>
                          <Text className="text-xs text-gray-500">
                            {t("organizerNumber")}: {org.organizerNumber}
                          </Text>
                        </div>
                        <Tag color="blue">{org.hajjCount} {t("hajjCount")}</Tag>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Gender Details Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            {selectedGender === "Male" ? (
              <ManOutlined className="text-mainColor text-xl" />
            ) : (
              <WomanOutlined className="text-mainColor text-xl" />
            )}
            <span>{selectedGender === "Male" ? t("maleOrganizers") : t("femaleOrganizers")}</span>
          </div>
        }
        open={genderModalVisible}
        onCancel={() => {
          setGenderModalVisible(false);
          setSelectedGender("");
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setGenderModalVisible(false);
              setSelectedGender("");
            }}
          >
            {t("close")}
          </Button>,
        ]}
        width={500}
      >
        {selectedGender && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="text-center">
                <div className="text-3xl font-bold text-mainColor mb-2">
                  {getOrganizersByGender(selectedGender).length}
                </div>
                <div className="text-sm text-gray-600">{t("organizers")}</div>
              </Card>
              <Card className="text-center">
                <div className="text-3xl font-bold text-mainColor mb-2">
                  {getHajjCountByGender(selectedGender)}
                </div>
                <div className="text-sm text-gray-600">{t("totalHajjCount")}</div>
              </Card>
            </div>
            <div>
              <Text strong className="text-gray-700 block mb-2">
                {t("organizersList")}:
              </Text>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {getOrganizersByGender(selectedGender).map((org) => (
                  <Card key={org.id} size="small" className="mb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <Text strong className="block">{org.company}</Text>
                        <Text className="text-xs text-gray-500">
                          {t("organizerNumber")}: {org.organizerNumber}
                        </Text>
                        <Text className="text-xs text-gray-500">
                          {t("nationality")}: {translateNationality(org.nationality)}
                        </Text>
                      </div>
                      <Tag color="blue">{org.hajjCount} {t("hajjCount")}</Tag>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrganizersPage;

