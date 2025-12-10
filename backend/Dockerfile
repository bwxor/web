FROM maven:3.9.10-amazoncorretto-24 AS build
WORKDIR /backend
COPY . .
RUN mvn clean package -DskipTests

FROM amazoncorretto:24.0.2-alpine3.22
WORKDIR /backend
COPY --from=build /backend/target/backend-0.0.1-SNAPSHOT.jar .
COPY .env /backend/.env
CMD ["java", "-jar", "backend-0.0.1-SNAPSHOT.jar"]
