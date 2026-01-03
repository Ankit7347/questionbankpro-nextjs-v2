# create models directory if not exists
# mkdir -p src/models
# mkdir -p src/models/mongoose
# # clear and recreate base entity
# : > src/models/BaseEntity.ts

# # clear and recreate core academic models
# : > src/models/EducationLevel.ts
# : > src/models/Course.ts
# : > src/models/Exam.ts
# : > src/models/Syllabus.ts
# : > src/models/Subject.ts
# : > src/models/Chapter.ts
# : > src/models/Topic.ts
# : > src/models/CompetitiveTopicMap.ts
# : > src/models/Question.ts
# : > src/models/Quiz.ts


# : > src/models/mongoose/base.schema.ts
# : > src/models/mongoose/EducationLevel.schema.ts
# : > src/models/mongoose/Course.schema.ts
# : > src/models/mongoose/Exam.schema.ts
# : > src/models/mongoose/Syllabus.schema.ts
# : > src/models/mongoose/Subject.schema.ts
# : > src/models/mongoose/Chapter.schema.ts
# : > src/models/mongoose/Topic.schema.ts
# : > src/models/mongoose/CompetitiveTopicMap.schema.ts
# : > src/models/mongoose/Question.schema.ts
# : > src/models/mongoose/Quiz.schema.ts

# # Create directories
# mkdir -p src/models/mongoose
# mkdir -p src/models/dto
# mkdir -p src/validation

# # Mongoose schema files
# : > src/models/mongoose/BestBook.schema.ts
# : > src/models/mongoose/ContactUs.schema.ts
# : > src/models/mongoose/GeolocationState.schema.ts
# : > src/models/mongoose/GeolocationDistrict.schema.ts
# : > src/models/mongoose/ResetToken.schema.ts
# : > src/models/mongoose/User.schema.ts

# # DTO mapper files
# : > src/models/dto/bestBook.mapper.ts
# : > src/models/dto/contactUs.mapper.ts
# : > src/models/dto/geolocation.mapper.ts
# : > src/models/dto/user.mapper.ts

# # Zod validation files
# : > src/validation/bestBook.schema.ts
# : > src/validation/contactUs.schema.ts
# : > src/validation/geolocation.schema.ts
# : > src/validation/user.schema.ts


echo "✔ All 10 model files cleared and ready in src/models"
