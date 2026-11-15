# TopoNote V-00

Topografia de campo para mina, picada, estrada, drone e frota. App web (Capacitor 6) que corre
offline no Android e no iPhone, com os mesmos ficheiros em `www/`.

| Item | Valor |
| --- | --- |
| Identificador | `com.toponote.app` |
| Versão | V-00 (versionCode 1) |
| Plataformas | `android/` (APK) e `ios/` (IPA) |
| Bibliotecas | locais em `www/vendor/` (Tailwind, Leaflet, Font Awesome, JSZip, PDF.js) |

## Manual de utilizador

O manual completo (13 páginas, com capturas de cada módulo) está em
[`docs/TopoNote-V-00-Manual.pdf`](docs/TopoNote-V-00-Manual.pdf).

## Gerar os pacotes no GitHub Actions

Repositório **público** → separador **Actions**:

- **Android build (TopoNote)** → artefacto `TopoNote-APK` com `TopoNote-V-00.apk`.
- **iOS build (TopoNote)** → artefacto `TopoNote-ipa` com `TopoNote-unsigned.ipa`
  (assinar no Sideloadly com Apple ID gratuito).

## Assinatura Android

Sem segredos, o APK usa a chave de debug (instala, mas não atualiza por cima de versões de
produção). Para assinar com a chave própria, criar os segredos do repositório:
`KEYSTORE_BASE64` (ficheiro `toponote.jks` em base64), `KEYSTORE_PASSWORD`, `KEY_ALIAS`,
`KEY_PASSWORD`.

## Compilar localmente

```bash
npm install
npx cap sync
cd android && ./gradlew assembleRelease     # APK
cd ios/App && pod install && open App.xcworkspace   # precisa de macOS
```

## Atualizar a app

Substituir a pasta `www/`, fazer commit e voltar a correr os workflows.

## Limitações no iOS

O Bluetooth serial (GNSS externo) é um plugin Android; no iPhone a app usa o GPS do aparelho.
