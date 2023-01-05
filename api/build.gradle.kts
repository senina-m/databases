buildscript {
    repositories {
        mavenLocal()
        maven ( url="https://maven.aliyun.com/repository/google/" )
        maven (url="https://maven.aliyun.com/repository/public/" )
        maven ( url="https://maven.aliyun.com/repository/spring/" )
        maven ( url ="https://maven.aliyun.com/repository/gradle-plugin/" )
        maven ( url ="https://maven.aliyun.com/repository/spring-plugin/" )

        mavenCentral()
    }
    dependencies {
        classpath("org.springframework.boot:spring-boot-gradle-plugin:2.3.2.RELEASE")
    }
}

plugins {
    id("org.springframework.boot") version("2.7.3")
    id("io.spring.dependency-management") version ("1.0.13.RELEASE")
    id("java")
    id("org.openapi.generator") version ("6.1.0")
}

group = "ru.sennik"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-logging")
    implementation("org.springframework.boot:spring-boot-starter-validation")

    implementation("org.springdoc:springdoc-openapi-ui:1.6.14")
    implementation("org.openapitools:jackson-databind-nullable:0.2.4")

    testImplementation("org.springframework.boot:spring-boot-starter-test")
}

tasks.getByName<Test>("test") {
    useJUnitPlatform()
}

openApiValidate {
    inputSpec.set("${project.projectDir}/src/main/resources/openapi.json")
    recommend.set(true)
}
