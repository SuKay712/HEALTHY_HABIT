# Bước 1: Xây dựng ứng dụng
FROM maven:3.3.4-openjdk-21 AS build
WORKDIR /app
COPY . /app
RUN mvn clean package -DskipTests

# Bước 2: Chạy ứng dụng
FROM openjdk:21-alpine
WORKDIR /app
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar /app/app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
