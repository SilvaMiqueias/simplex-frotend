import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLoading } from "./LoadingContext";
import OtpInput from 'react-otp-input';

export default function TwoFactor() {
  const [code, setCode] = useState("");
  const { setLoading, loading } = useLoading();
  const [error, setError] = useState("");
  const { qrCode, status } = useAuth();
  const [showQrCode, setShowQrCode] = useState(false);
  const { verify2FA, logout } = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    if (status === "2fa_setup") {
      setShowQrCode(true);
    }
  }, [status]);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (code.length !== 6) {
      setError("O código deve ter 6 dígitos");
      return;
    }

    try {
      setLoading(true);
      await verify2FA(code);

      navigate("/dashboard");
      toast.success('Logado com sucesso!');
    } catch {
      toast.error('Código Inválido')
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{display: "flex", flexDirection: "column", margin: "20px", justifyContent: "center", alignItems: "center", marginTop: "10%"}}>
      <div className="w-full max-w-xl mx-auto rounded-xl border border-zinc-800 bg-zinc-900/90 backdrop-blur p-8 shadow-lg shadow-black/30 ">
          {showQrCode && qrCode && (
        
                <div style={{ textAlign: "center", display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", gap: "32px" }}>
                    <h1 style={{fontSize: "25px", fontWeight: 700}}>Escanei o QR Code</h1>
                      <img
                        style={{backgroundColor: "transparent"}}
                        src={`data:image/png;base64,${qrCode}`}
                        alt="QR Code para autenticação em dois fatores"
                        width={180}
                        height={180}
                      />

                    <button
                      type="button"
                      onClick={() => setShowQrCode(false)}
                      style={{padding: "8px 16px", textDecoration: "none", borderRadius: "5px"}}
                      className="
                        w-[140px] h-[42px]

                      bg-white
                      text-black
                      hover:bg-sky-600
                      hover:text-white
                      active:bg-emerald-800

                      disabled:bg-emerald-600/50
                      disabled:cursor-not-allowed

                      focus:outline-none
                      focus:ring-2
                      focus:ring-emerald-500
                      focus:ring-offset-2
                      focus:ring-offset-zinc-900

                      transition-alll"
                    >
                      Inserir Código
                    </button>
              </div>   
          )}

           {status === "2fa_required" && !showQrCode && (    
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: "32px" , textAlign: "justify"}}>
          <h1 style={{fontWeight: 700, fontSize: "25px"}}>Autenticação em dois fatores</h1>

          <p style={{fontWeight: 700}}>
            Digite o código gerado no seu aplicativo autenticador
          </p>

      <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column", gap: "32px" }}>
   

            <OtpInput
                  value={code}
                  onChange={setCode}
                  numInputs={6}
                  shouldAutoFocus
                  renderSeparator={
                    <span className="mx-2 h-1.5 w-1.5 rounded-full bg-gray-500/60" />
                  }
                  renderInput={(props) => (
                      <input
                      {...props}
                      className="
                        !w-14 !h-14
                        aspect-square
                        box-border

                        px-1 py-0.5
                        leading-none

                        bg-transparent
                        border border-zinc-600
                        rounded-md

                        text-white
                        text-xl
                        text-center

                        outline-none
                        focus:outline-none
                        focus:ring-0

                        transition-colors duration-150
                        focus:border-sky-400
                      "
                    />
                    )}
             />
                  <div style={{display: "flex", flexDirection: "row", gap: "24px"}}>
                      <button style={{padding: "8px 16px", borderRadius: "5px", width: "120px", height: "42px"}} type="submit" disabled={loading} 
                      className="  w-[120px] h-[42px]

                      bg-white
                      text-black

                      rounded-md
                      px-4 py-2

                      hover:bg-emerald-700
                      hover:text-white
                      active:bg-emerald-800

                      disabled:bg-emerald-600/50
                      disabled:cursor-not-allowed

                      focus:outline-none
                      focus:ring-2
                      focus:ring-emerald-500
                      focus:ring-offset-2
                      focus:ring-offset-zinc-900

                      transition-alll"
                      >
                              {loading ? "Validando..." : "Confirmar"}
                      </button>
                      <button type="button" onClick={logout} style={{ padding: "8px 16px", borderRadius: "5px", height: "42px", width: "120px"}} 
                      className="   border border-zinc-700
                    hover:border-red-500
                    hover:text-red-500
                    focus:border-red-500
                    focus:outline-none
                    transition-colors
                      ">
                            Cancelar
                      </button>
                  </div>
        
       </form>

   
                    <button
                      type="button"
                      onClick={() => setShowQrCode(true)}
                      className="
                        text-sm
                        text-sky-400
                        hover:text-sky-300
                        underline
                        mt-2
                        text-justify
                      "
                    >
                      Precisa escanear o QR Code novamente?
                    </button>      
 </div>  )}
</div>
     
      
</div>
    
);}
