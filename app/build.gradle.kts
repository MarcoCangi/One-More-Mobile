/*
 * This file was generated by the Gradle 'init' task.
 */

plugins {
    id("buildlogic.java-application-conventions")
}

dependencies {
    implementation("org.apache.commons:commons-text")
    implementation(project(":utilities"))
    implementation("com.google.firebase:firebase-bom:33.7.0")
    implementation("com.google.firebase:firebase-analytics")
}

application {
    // Define the main class for the application.
    mainClass = "org.example.app.App"
}
