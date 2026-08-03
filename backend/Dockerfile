FROM gradle:8.7.0-jdk17 AS build
WORKDIR /workspace

COPY settings.gradle build.gradle ./
COPY gradle ./gradle
COPY src ./src

RUN gradle clean bootJar --no-daemon

FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=build /workspace/build/libs/*.jar /app/app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
