package io.ionic.starter;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

// ✅ Import corretto di FirebaseApp
import com.google.firebase.FirebaseApp;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // ✅ Inizializzazione Firebase Native
        FirebaseApp.initializeApp(this);
    }
}
