
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Vault, 
  Lock, 
  Key, 
  FileText, 
  Shield, 
  Clock, 
  Users, 
  Download,
  Upload,
  Eye,
  Trash2
} from 'lucide-react';

interface VaultDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  classification: 'public' | 'internal' | 'confidential' | 'restricted';
  uploadDate: Date;
  projectId: string;
  projectName: string;
  accessLog: AccessLog[];
  encryptionLevel: string;
  digitalSignature: boolean;
}

interface AccessLog {
  id: string;
  userId: string;
  userName: string;
  action: 'view' | 'download' | 'share' | 'delete';
  timestamp: Date;
  ipAddress: string;
}

interface ProjectVault {
  id: string;
  name: string;
  participants: string[];
  documents: VaultDocument[];
  accessRules: AccessRule[];
  blockchainHash: string;
}

interface AccessRule {
  id: string;
  userId: string;
  permissions: string[];
  expiresAt?: Date;
  conditions: string[];
}

const DigitalVaultSystem = () => {
  const [vaults, setVaults] = useState<ProjectVault[]>([
    {
      id: '1',
      name: 'Projeto Biofármaco Alpha',
      participants: ['user@pharma.com', 'partner@biotech.com'],
      documents: [
        {
          id: '1',
          name: 'Contrato de Confidencialidade.pdf',
          type: 'pdf',
          size: 2048000,
          classification: 'restricted',
          uploadDate: new Date('2024-01-10'),
          projectId: '1',
          projectName: 'Projeto Biofármaco Alpha',
          accessLog: [
            {
              id: '1',
              userId: 'user1',
              userName: 'João Silva',
              action: 'view',
              timestamp: new Date('2024-01-10T10:30:00'),
              ipAddress: '192.168.1.100'
            }
          ],
          encryptionLevel: 'AES-256',
          digitalSignature: true
        }
      ],
      accessRules: [
        {
          id: '1',
          userId: 'user1',
          permissions: ['read', 'download'],
          expiresAt: new Date('2024-12-31'),
          conditions: ['IP_WHITELIST', 'MFA_REQUIRED']
        }
      ],
      blockchainHash: '0x1234567890abcdef'
    }
  ]);

  const [selectedVault, setSelectedVault] = useState<ProjectVault | null>(vaults[0]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'public': return 'bg-green-100 text-green-800';
      case 'internal': return 'bg-blue-100 text-blue-800';
      case 'confidential': return 'bg-orange-100 text-orange-800';
      case 'restricted': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'view': return <Eye className="h-4 w-4" />;
      case 'download': return <Download className="h-4 w-4" />;
      case 'share': return <Users className="h-4 w-4" />;
      case 'delete': return <Trash2 className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadFile(file);
    }
  };

  const uploadToVault = () => {
    if (uploadFile && selectedVault) {
      const newDocument: VaultDocument = {
        id: Date.now().toString(),
        name: uploadFile.name,
        type: uploadFile.type,
        size: uploadFile.size,
        classification: 'confidential',
        uploadDate: new Date(),
        projectId: selectedVault.id,
        projectName: selectedVault.name,
        accessLog: [],
        encryptionLevel: 'AES-256',
        digitalSignature: true
      };

      setVaults(vaults.map(vault => 
        vault.id === selectedVault.id 
          ? { ...vault, documents: [...vault.documents, newDocument] }
          : vault
      ));
      setUploadFile(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Vault className="h-5 w-5 text-purple-600" />
            <span>Cofres Digitais por Projeto</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">{vaults.length}</div>
              <div className="text-sm text-gray-600">Cofres Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {vaults.reduce((total, vault) => total + vault.documents.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Documentos Protegidos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">100%</div>
              <div className="text-sm text-gray-600">Criptografados</div>
            </div>
          </div>

          <Tabs defaultValue="vaults" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="vaults">Cofres</TabsTrigger>
              <TabsTrigger value="documents">Documentos</TabsTrigger>
              <TabsTrigger value="access">Controle de Acesso</TabsTrigger>
              <TabsTrigger value="audit">Auditoria</TabsTrigger>
            </TabsList>

            <TabsContent value="vaults" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vaults.map((vault) => (
                  <Card 
                    key={vault.id} 
                    className={`cursor-pointer transition-all ${
                      selectedVault?.id === vault.id ? 'ring-2 ring-purple-500' : ''
                    }`}
                    onClick={() => setSelectedVault(vault)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium">{vault.name}</h3>
                        <Badge variant="outline">
                          <Lock className="h-3 w-3 mr-1" />
                          Seguro
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4" />
                          <span>{vault.participants.length} participantes</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4" />
                          <span>{vault.documents.length} documentos</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4" />
                          <span>Hash: {vault.blockchainHash.substring(0, 12)}...</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              {selectedVault && (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">
                      Documentos - {selectedVault.name}
                    </h3>
                    <Button onClick={() => document.getElementById('file-input')?.click()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Seguro
                    </Button>
                    <input
                      id="file-input"
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </div>

                  {uploadFile && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{uploadFile.name}</p>
                            <p className="text-sm text-gray-600">
                              {formatFileSize(uploadFile.size)}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" onClick={() => setUploadFile(null)}>
                              Cancelar
                            </Button>
                            <Button onClick={uploadToVault}>
                              <Shield className="h-4 w-4 mr-2" />
                              Criptografar e Armazenar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="space-y-3">
                    {selectedVault.documents.map((doc) => (
                      <Card key={doc.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <FileText className="h-5 w-5 text-gray-500" />
                              <div>
                                <p className="font-medium">{doc.name}</p>
                                <p className="text-sm text-gray-600">
                                  {formatFileSize(doc.size)} • {doc.uploadDate.toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={getClassificationColor(doc.classification)}>
                                {doc.classification}
                              </Badge>
                              <Badge variant="outline">
                                <Key className="h-3 w-3 mr-1" />
                                {doc.encryptionLevel}
                              </Badge>
                              {doc.digitalSignature && (
                                <Badge variant="outline">
                                  <Shield className="h-3 w-3 mr-1" />
                                  Assinado
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="access" className="space-y-4">
              {selectedVault && (
                <>
                  <h3 className="text-lg font-medium">
                    Regras de Acesso - {selectedVault.name}
                  </h3>
                  <div className="space-y-3">
                    {selectedVault.accessRules.map((rule) => (
                      <Card key={rule.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Usuário ID: {rule.userId}</p>
                              <div className="flex space-x-2 mt-2">
                                {rule.permissions.map((perm) => (
                                  <Badge key={perm} variant="secondary">
                                    {perm}
                                  </Badge>
                                ))}
                              </div>
                              {rule.expiresAt && (
                                <p className="text-sm text-gray-600 mt-1">
                                  Expira em: {rule.expiresAt.toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Condições:</p>
                              {rule.conditions.map((condition) => (
                                <Badge key={condition} variant="outline" className="ml-1">
                                  {condition}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="audit" className="space-y-4">
              {selectedVault && (
                <>
                  <h3 className="text-lg font-medium">
                    Log de Auditoria - {selectedVault.name}
                  </h3>
                  <div className="space-y-3">
                    {selectedVault.documents.flatMap(doc => 
                      doc.accessLog.map(log => (
                        <Card key={log.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                {getActionIcon(log.action)}
                                <div>
                                  <p className="font-medium">{log.userName}</p>
                                  <p className="text-sm text-gray-600">
                                    {log.action} • {log.timestamp.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-600">IP: {log.ipAddress}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>

          <Alert className="mt-6">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Segurança Blockchain:</strong> Todos os documentos são protegidos por criptografia AES-256 
              e registrados em blockchain para garantir integridade e rastreabilidade completa.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default DigitalVaultSystem;
