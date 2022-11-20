import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TrendingComponent } from "./trending/trending.component";
import { getFirestore, provideFirestore } from "@angular/fire/firestore";
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import { LoginComponent } from './login/login.component';
import { getAuth, provideAuth } from "@angular/fire/auth";
import { BanListComponent } from './ban-list/ban-list.component';


const config = {
  apiKey: "AIzaSyC0wYP-4s0yGuy7gGxq_MFmRXSGsgjM2h8",
  authDomain: "trending-bedd2.firebaseapp.com",
  projectId: "trending-bedd2",
  storageBucket: "trending-bedd2.appspot.com",
  messagingSenderId: "324327221879",
  appId: "1:324327221879:web:820b3f534522e7f2a4f472"
};

@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    BanListComponent,
    provideFirebaseApp(() => initializeApp(config)),
    provideAuth(() => getAuth()),
    provideFirestore(() => {
      return getFirestore();
      // connectFirestoreEmulator(firestore, 'localhost', 8080);
      //return firestore;
    }),
    TrendingComponent,
    LoginComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
