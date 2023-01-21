plugins {
    id("org.springframework.boot") version "2.7.3"
    id("io.spring.dependency-management") version "1.0.13.RELEASE"
    id("org.openapi.generator") version "6.1.0"
    kotlin("jvm") version "1.7.22"
    kotlin("plugin.spring") version "1.7.22"
    kotlin("plugin.jpa") version "1.7.22"
}

group = "ru.sennik"
version = "0.0.1-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_14

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springdoc:springdoc-openapi-ui:1.6.14")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
    implementation("org.slf4j:slf4j-simple:2.0.5")
    implementation("io.github.microutils:kotlin-logging-jvm:3.0.4")
    implementation("org.liquibase:liquibase-core")
    developmentOnly("org.springframework.boot:spring-boot-devtools")
    runtimeOnly("org.postgresql:postgresql")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.security:spring-security-test")
}

tasks.compileKotlin {
    kotlinOptions {
        freeCompilerArgs = listOf("-Xjsr305=strict")
        jvmTarget = "14"
    }
    dependsOn(tasks.openApiGenerate)
}

tasks.withType<Test> {
    useJUnitPlatform()
}

openApiGenerate {
    generatorName.set("kotlin-spring")
    outputDir.set("${buildDir}/api/generated")
    inputSpec.set("${projectDir}/../api/src/main/resources/openapi.json")
    apiPackage.set("ru.sennik.backend.generated.controller")
    modelPackage.set("ru.sennik.backend.generated.dto")
    modelNameSuffix.set("Dto")
    apiNameSuffix.set("Controller")
    configOptions.set(mapOf(
        "dateLibrary" to "java8",
        "interfaceOnly" to "true",
        "openApiNullable" to "false",
        "library" to "spring-boot",
        "useTags" to "true",
        "gradleBuildFile" to "false",
        "documentationProvider" to "none",
        "enumPropertyNaming" to "UPPERCASE"
    ))
}

sourceSets["main"].kotlin {
    srcDir("${buildDir}/api/generated/src/main/kotlin")
}
