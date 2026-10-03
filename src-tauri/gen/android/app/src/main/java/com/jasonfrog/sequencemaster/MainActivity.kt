package com.jasonfrog.sequencemaster

import android.graphics.Color
import android.os.Bundle
import android.view.View
import androidx.activity.enableEdgeToEdge
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.updatePadding

class MainActivity : TauriActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    enableEdgeToEdge()
    super.onCreate(savedInstanceState)
    // 状态栏/刘海：把系统 inset 补到内容区顶部 padding，露出的窗口底色与页头同色（slate-800）
    findViewById<View>(android.R.id.content)?.let { content ->
      content.setBackgroundColor(Color.parseColor("#1E293B"))
      ViewCompat.setOnApplyWindowInsetsListener(content) { v, insets ->
        val bars = insets.getInsets(
          WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.displayCutout()
        )
        v.updatePadding(top = bars.top)
        insets
      }
    }
  }
}
