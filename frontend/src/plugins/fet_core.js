// ---------------------------------------------------------------------------
//
//                     Web Crypto API high level wrapper
//
//   IMPORTANT: file :=> DN_ID + NAME_LEN + NAME + IV + SALT + GCM_RESULT;
//               https://www.w3.org/TR/WebCryptoAPI/#aes-gcm
//                      GCM_RESULT :=> C || TAG;
//
// ---------------------------------------------------------------------------

function fet_progress(vc, m, v) {
	console.log(m);
	console.log(v);
}

let fet_prgr_ = fet_progress;

function set_progress(f) {
	if ( !f ) {
		f = fet_progress;
	}

	fet_prgr_ = f;
}

function error_cb(err) {
	console.log(err);
}

let fet_error_ = error_cb;

function set_error(f) {
	if ( !f ) {
		f = error_cb;
	}

	fet_error_ = f;
}

// ---------------------------------------------------------------------------

//
// DANGER: ABI, can't change crypto params/setup;
//
const MIN_PWD     = 16;
const KDF_TYPE    = "PBKDF2";
const KDF_ITER    = 10000;
const KDF_HASH    = "SHA-256";
const AES_MODE    = "AES-GCM";
const AES_KEY_LEN = 256;
const AES_TAG_LEN = 128;
const SALT_LEN    = 64;
const IV_LEN      = 16;
const TAG_LEN     = 16;

//
// DANGER: file ABI, first byte == version 1;
//
const FID = new Uint8Array([0x01, 0x44, 0x49, 0x4e, 0x41, 0x4d, 0x4f, 0x20,
                            0x4e, 0x65, 0x74, 0x77, 0x6f, 0x72, 0x6b, 0x73]);

function drbg(d) {
	return crypto.getRandomValues(d);
}

function kdf_mat(vc) {
	let te = new TextEncoder();
	return crypto.subtle.importKey("raw", te.encode(vc.pwd),
	                               KDF_TYPE, false, [ "deriveKey" ]);
}

function kdf(vc, rnd_salt) {
	fet_prgr_(vc, "obtendo material da chave...", 3);

	return kdf_mat(vc).then((km) => {
		fet_prgr_(vc, "material da chave obtido...", 5);

		if ( rnd_salt ) {
			vc.salt = drbg(new Uint8Array(SALT_LEN));
		}

		return crypto.subtle.deriveKey({ name: KDF_TYPE,
		                                 salt: vc.salt,
		                                 iterations: KDF_ITER,
		                                 hash: KDF_HASH }, km,
		                               { name: AES_MODE,
		                                 length: AES_KEY_LEN },
		                               false, [ "encrypt", "decrypt" ]);
	});
}

function save_file(vc, name, blob) {
	let a = document.createElement("a");

	a.style.display = "none";
	a.download      = name;
	a.href          = URL.createObjectURL(blob,
	                                  { type: "application/octet-stream" });
	document.body.appendChild(a);

	a.click();

	document.body.removeChild(a);

	fet_prgr_(vc, "Arquivo gravado.", 100);
}

function save_enc_file(vc, buf) {
	let te  = new TextEncoder();
	let fn  = te.encode(vc.file_name);
	let u8l = new Uint8Array([0]);

	u8l.fill(fn.byteLength);

	save_file(vc, vc.file_name + ".dlp",
	          new Blob([FID, u8l, fn, vc.iv, vc.salt, buf]));
}

//
// assumes checked dlp len >= FID len;
//
function dlp_hdr_match(dlp) {
	const HDR = dlp.slice(0, FID.byteLength);

	for ( let i = 0; i < FID.byteLength; i++ ) {
		if ( HDR[i] != FID[i] ) {
			return false;
		}
	}

	return true;
}

function dlp_file_setup(vc, buf) {
	let dlp  = new Uint8Array(buf.result);
	let flen = dlp.byteLength;

	flen -= (FID.byteLength + 1 + IV_LEN + SALT_LEN + TAG_LEN);

	let o_n_len = 0;

	if ( flen > 0 ) {
		o_n_len = dlp[FID.byteLength];
		flen -= o_n_len;
	}

	if ( flen <= 1 || !dlp_hdr_match(dlp) ) {
		fet_error_("Arquivo não reconhecido.");
		return false;
	}

	const FNLS = FID.byteLength;
	const FNS  = FNLS + 1;
	const IVS  = FNS + o_n_len;
	const SS   = IVS + IV_LEN;

	vc.iv   = dlp.slice(IVS, IVS + IV_LEN);
	vc.salt = dlp.slice(SS, SS + SALT_LEN);

	let td = new TextDecoder();
	let fn = td.decode(dlp.slice(FNS, FNS + dlp[FNLS]));

	const GS = SS + SALT_LEN;

	vc.file_name = fn;
	vc.file_size = flen;
	vc.d         = dlp.slice(GS, GS + TAG_LEN + flen);

	return true;
}

function save_dec_file(vc, buf) {
	save_file(vc, vc.file_name, new Blob([buf]));
}

function get_file_info(vc, msg) {
	return "Arquivo" + msg + ": " +
		vc.file_name + " [" + vc.file_size + " byte(s)]";
}

function aes_gcm_alg(vc) {
	return { name: AES_MODE, iv: vc.iv, tagLength: AES_TAG_LEN };
}

function encrypt(vc, buf) {
	vc.file_info = get_file_info(vc, " selecionado");

	kdf(vc, true).then((k) => {
		fet_prgr_(vc, "chave derivada...", 37);

		vc.iv = drbg(new Uint8Array(IV_LEN));
		vc.d  = new Uint8Array(buf.result);

		return crypto.subtle.encrypt(aes_gcm_alg(vc), k, vc.d);

	}).then((ebuf) => {
		fet_prgr_(vc, "buffer encriptado gerado...", 89);

		save_enc_file(vc, ebuf);

	}).catch(fet_error_);
}

function decrypt(vc, buf) {
	if ( !dlp_file_setup(vc, buf) ) {
		return;
	}

	vc.file_info = get_file_info(vc, " original");

	kdf(vc, false).then((k) => {
		fet_prgr_(vc, "chave derivada...", 37);

		return crypto.subtle.decrypt(aes_gcm_alg(vc), k, vc.d);

	}).then((dbuf) => {
		fet_prgr_(vc, "buffer decriptado gerado...", 89);

		save_dec_file(vc, dbuf);

	}).catch(fet_error_);
}

// ---------------------------------------------------------------------------

export {
	decrypt,
	encrypt,
	set_progress,
	set_error,
	MIN_PWD
};

// ---------------------------------------------------------------------------
