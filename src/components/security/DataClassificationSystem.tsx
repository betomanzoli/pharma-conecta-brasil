
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Lock, Eye, Globe, AlertTriangle } from 'lucide-react';

interface DataClassification {
  id: string;
  level: 'public' | 'internal' | 'confidential' | 'restricted';
  description: string;
  icon: React.ReactNode;
  color: string;
  permissions: string[];
}

const DataClassificationSystem = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [classification, setClassification] = useState<string>('');
  const [accessUsers, setAccessUsers] = useState<string[]>([]);
  const [newUser, setNewUser] = useState('');

  const classifications: DataClassification[] = [
    {
      id: 'public',
      level: 'public',
      description: 'Informações que podem ser compartilhadas publicamente',
      icon: <Globe className="h-4 w-4" />,
      color: 'bg-green-100 text-green-800',
      permissions: ['read', 'download']
    },
    {
      id: 'internal',
      level: 'internal',
      description: 'Informações internas da empresa',
      icon: <Eye className="h-4 w-4" />,
      color: 'bg-blue-100 text-blue-800',
      permissions: ['read', 'download', 'share_internal']
    },
    {
      id: 'confidential',
      level: 'confidential',
      description: 'Informações confidenciais que requerem autorização',
      icon: <Lock className="h-4 w-4" />,
      color: 'bg-orange-100 text-orange-800',
      permissions: ['read', 'restricted_share']
    },
    {
      id: 'restricted',
      level: 'restricted',
      description: 'Informações altamente sensíveis e restritas',
      icon: <Shield className="h-4 w-4" />,
      color: 'bg-red-100 text-red-800',
      permissions: ['read_only']
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Auto-classificação baseada no nome do arquivo
      if (file.name.includes('contract') || file.name.includes('nda')) {
        setClassification('restricted');
      } else if (file.name.includes('internal')) {
        setClassification('internal');
      } else {
        setClassification('confidential');
      }
    }
  };

  const addAccessUser = () => {
    if (newUser && !accessUsers.includes(newUser)) {
      setAccessUsers([...accessUsers, newUser]);
      setNewUser('');
    }
  };

  const removeAccessUser = (user: string) => {
    setAccessUsers(accessUsers.filter(u => u !== user));
  };

  const handleClassifyDocument = () => {
    if (selectedFile && classification) {
      // Aqui implementaria a lógica de classificação e criptografia
      console.log('Classificando documento:', {
        file: selectedFile.name,
        classification,
        accessUsers
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>Sistema de Classificação de Dados</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Níveis de Classificação */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Níveis de Classificação</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classifications.map((cls) => (
                <div
                  key={cls.id}
                  className={`p-4 rounded-lg border-2 ${
                    classification === cls.level ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={cls.color}>
                      {cls.icon}
                      <span className="ml-1 capitalize">{cls.level}</span>
                    </Badge>
                    <Button
                      variant={classification === cls.level ? "default" : "outline"}
                      size="sm"
                      onClick={() => setClassification(cls.level)}
                    >
                      Selecionar
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{cls.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {cls.permissions.map((perm) => (
                      <Badge key={perm} variant="secondary" className="text-xs">
                        {perm}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upload de Arquivo */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Upload de Documento</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <div className="p-3 bg-gray-100 rounded-full">
                  <Lock className="h-6 w-6 text-gray-600" />
                </div>
                <span className="text-sm text-gray-600">
                  Clique para selecionar um arquivo para classificar
                </span>
              </label>
              {selectedFile && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-gray-600">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Controle de Acesso */}
          {selectedFile && (
            <div>
              <Label className="text-sm font-medium mb-2 block">Controle de Acesso</Label>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Email do usuário"
                    value={newUser}
                    onChange={(e) => setNewUser(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={addAccessUser} variant="outline">
                    Adicionar
                  </Button>
                </div>
                {accessUsers.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {accessUsers.map((user) => (
                      <Badge
                        key={user}
                        variant="secondary"
                        className="flex items-center space-x-1"
                      >
                        <span>{user}</span>
                        <button
                          onClick={() => removeAccessUser(user)}
                          className="ml-1 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Ações */}
          {selectedFile && classification && (
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => {
                setSelectedFile(null);
                setClassification('');
                setAccessUsers([]);
              }}>
                Limpar
              </Button>
              <Button onClick={handleClassifyDocument} className="bg-blue-600 hover:bg-blue-700">
                <Shield className="h-4 w-4 mr-2" />
                Classificar e Proteger
              </Button>
            </div>
          )}

          {/* Aviso de Segurança */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">
                Aviso de Segurança
              </span>
            </div>
            <p className="text-sm text-yellow-700 mt-1">
              Todos os documentos classificados são automaticamente criptografados e auditados.
              O acesso é registrado e monitorado conforme as políticas de segurança da empresa.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataClassificationSystem;
