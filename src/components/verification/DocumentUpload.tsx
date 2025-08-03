
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import { useVerification } from '@/hooks/useVerification';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const DocumentUpload = () => {
  const { user, profile } = useAuth();
  const { uploadDocument, loading, documents } = useVerification();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const documentTypes = [
    { value: 'cnpj_certificate', label: 'Certidão de CNPJ', description: 'Documento oficial da Receita Federal' },
    { value: 'anvisa_license', label: 'Licença ANVISA', description: 'Autorização de funcionamento ANVISA' },
    { value: 'professional_certificate', label: 'Certificado Profissional', description: 'Certificado de formação ou registro profissional' },
    { value: 'company_registration', label: 'Registro da Empresa', description: 'Contrato social ou ata de constituição' },
    { value: 'laboratory_accreditation', label: 'Acreditação de Laboratório', description: 'Certificado de acreditação (ISO, INMETRO, etc.)' }
  ];

  const allowedFileTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/jpg'
  ];

  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = async (file: File) => {
    if (!selectedDocumentType) {
      toast({
        title: "Erro",
        description: "Selecione o tipo de documento antes de fazer o upload",
        variant: "destructive"
      });
      return;
    }

    // Validar tipo de arquivo
    if (!allowedFileTypes.includes(file.type)) {
      toast({
        title: "Arquivo não suportado",
        description: "Use apenas arquivos PDF, JPEG ou PNG",
        variant: "destructive"
      });
      return;
    }

    // Validar tamanho do arquivo
    if (file.size > maxFileSize) {
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 10MB",
        variant: "destructive"
      });
      return;
    }

    await uploadDocument(file, selectedDocumentType);
    
    // Reset
    setSelectedDocumentType('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    const docType = documentTypes.find(dt => dt.value === type);
    return docType?.label || type;
  };

  const hasDocumentType = (type: string) => {
    return documents.some(doc => doc.document_type === type);
  };

  if (!user || !profile) return null;

  return (
    <div className="space-y-6">
      {/* Upload de Documento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Upload de Documentos</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Seletor de Tipo de Documento */}
          <div className="space-y-2">
            <Label htmlFor="documentType">Tipo de Documento</Label>
            <Select value={selectedDocumentType} onValueChange={setSelectedDocumentType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de documento" />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center justify-between w-full">
                      <span>{type.label}</span>
                      {hasDocumentType(type.value) && (
                        <CheckCircle className="h-4 w-4 text-green-600 ml-2" />
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedDocumentType && (
              <p className="text-sm text-muted-foreground">
                {documentTypes.find(dt => dt.value === selectedDocumentType)?.description}
              </p>
            )}
          </div>

          {/* Área de Drop */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">
              Arraste e solte seu arquivo aqui
            </h3>
            <p className="text-muted-foreground mb-4">
              ou clique para selecionar
            </p>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={!selectedDocumentType || loading}
            >
              {loading ? 'Enviando...' : 'Selecionar Arquivo'}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
            />
            <p className="text-xs text-muted-foreground mt-4">
              Formatos aceitos: PDF, JPEG, PNG (máx. 10MB)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Documentos Enviados */}
      {documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Documentos Enviados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <div>
                      <h4 className="font-medium">{getDocumentTypeLabel(doc.document_type)}</h4>
                      <p className="text-sm text-muted-foreground">
                        {doc.file_name} • {new Date(doc.uploaded_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentUpload;
